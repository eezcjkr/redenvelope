/**
 * Copyright (c) 2018-present, Leap DAO (leapdao.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { computed, observable, reaction, autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Form, Button, Table, Select } from 'antd';
import autobind from 'autobind-decorator';

import { EventLog } from 'web3/types';

import TokenValue from '../../components/tokenValue';
import AmountInput from '../../components/amountInput';
import Tokens from '../../stores/tokens';
import Network from '../../stores/network';
import ExitHandler from '../../stores/exitHandler';
import { BigIntType, bi, ZERO, greaterThan, lessThanOrEqual } from 'jsbi-utils';
import PlasmaConfig from '../../stores/plasmaConfig';
import Unspents from '../../stores/unspents';
import storage from '../../utils/storage';
import Web3Store from '../../stores/web3';
import EtherscanLink from '../../components/etherscanLink';
import HexString from '../../components/hexString';
import Account from '../../stores/account';

const { Fragment } = React;

interface DepositProps {
  tokens?: Tokens;
  network?: Network;
  exitHandler?: ExitHandler;
  color: number;
  plasmaConfig?: PlasmaConfig;
  unspents?: Unspents;
  web3?: Web3Store;
  onColorChange: (color: number) => void;
  account?: Account;
  num?: number;
  value?: number;
}

type PendingDeposit = {
  value: string;
  color: number;
  txId: string;
  blockNumber?: number;
};

@inject('tokens', 'exitHandler', 'network', 'plasmaConfig', 'unspents', 'web3', 'account')
@observer
export default class Deposit extends React.Component<DepositProps, any> {
  @computed
  get selectedToken() {
    const { tokens, color } = this.props;
    return tokens && tokens.tokenForColor(color);
  }

  @observable
  value: number | string = this.props.value;

  @observable
  receipients: number | string;

  @observable
  funding: boolean = false;

  @observable
  funded: boolean = false;

  @observable
  wallet: string = "";

  constructor(props) {
    super(props);
  }

  @autobind
  handleSubmit(e) {
    e.preventDefault();
    this.funding = true;
    // return new Promise((resolve, reject) => {
    //   this.funding = true;
    //   setTimeout(() => resolve(), 5000);
    // })
    // .then(() => {
    //   this.funding = false;
    //   this.funded = true;
    // })
    return fetch("https://c90vfqfc1l.execute-api.eu-west-1.amazonaws.com/testnet/fund", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numRecipients: this.receipients,
          from: this.props.account.address,
          color: this.props.color,
        }), 
    })
    .then(response => response.json())
    .then(r => {
      console.log(r);
      const addr = r.address;
      this.wallet = addr;
      return this.selectedToken
        .transfer(
          addr,
          bi(this.selectedToken.toCents(this.value))
        )
    })
    .then(a => {
      this.funded = true;
      this.funding = false;
      console.log(a);
    });
  }

  canSubmitValue(value: BigIntType) {
    const { network } = this.props;
    return (
      true
      // network.canSubmit &&
      // value &&
      // this.receipients > 0 //&&
      // greaterThan(bi(value), ZERO) &&
      // (this.selectedToken.isNft ||
      //   lessThanOrEqual(bi(value), this.selectedToken.balance))
    );
  }

  render() {
    const { tokens, color, onColorChange, plasmaConfig } = this.props;
    const width = 100;

    return (
      <Fragment>

        {(!this.funding && !this.funded) && (
        <div>
        <h2>Create Red Envelope</h2>

        <Form onSubmit={this.handleSubmit} layout="inline">
          <div className="wallet-input">
            <AmountInput
              amount={this.props.value}
              placeholder="Amount to gift"
              value={this.value}
              onChange={value => {
                this.value = value;
              }}
              color={color}
              onColorChange={newColor => {
                onColorChange(newColor);
                this.value = tokens.tokenForColor(newColor).isNft
                  ? ''
                  : this.value;
              }}
            />
          </div>

          <div>
            <Form.Item>
              <Fragment>
                Number of recipients: 
              </Fragment>
              <Select
                style={{ width }}
                onChange={(value: number) => {
                  this.receipients = value;
                }}
                defaultValue={this.props.num}
              >
                {[...Array(16).keys()].map(num => num+1).map(num => (
                  <Select.Option
                    key={num.toString()}
                    value={num}
                  >
                    {num}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item>
            <Button
              htmlType="submit"
              type="primary"
              disabled={
                !this.canSubmitValue(this.selectedToken.toCents(this.value))
              }
            >
              Seal
            </Button>
          </Form.Item>
        </Form>

        <dl className="info" style={{ marginTop: 10 }}>
          <dt>Plasma balance</dt>
          <dd>
            <TokenValue
              value={this.selectedToken.plasmaBalance}
              color={this.selectedToken.color}
            />
          </dd>
        </dl>
        </div>
        )}

        {this.funding && (
          <Fragment>
            Creating envelope:
            <img src="http://www.clipartbest.com/cliparts/eTM/Ajo/eTMAjoATn.gif" />
          </Fragment>
        )}

        {this.funded && (
          <Fragment>
            Your envelope has been funded. Send this link into a chat: <br/>
            <HexString>{"http://redenvelope.me/claim/" + this.wallet}</HexString>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
