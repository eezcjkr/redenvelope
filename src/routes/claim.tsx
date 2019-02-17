/**
 * Copyright (c) 2018-present, Leap DAO (leapdao.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { observer, inject } from 'mobx-react';
import AppLayout from '../components/appLayout';

import Account from '../stores/account';

import { computed, observable, reaction, autorun } from 'mobx';


import { CONFIG } from '../config';

import Tokens from '../stores/tokens';
import { BigIntType, bi, ZERO, greaterThan, lessThanOrEqual } from 'jsbi-utils';



interface Params {
  addr: string
}

interface Match {
  params: Params
}

interface ClaimProps {
  match: Match;
  account?: Account;
  tokens?: Tokens;
}

@inject('account', 'tokens')
@observer
export default class Claim extends React.Component<ClaimProps> {

  @computed
  get selectedToken() {
    const { tokens } = this.props;
    return tokens && tokens.tokenForColor(0);
  }

  @observable
  initing: boolean = true;

  @observable
  success: boolean = false;

  @observable
  amount: number;

  constructor(props) {
    super(props);

    this.init = this.init.bind(this);

    this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      console.log(this.props.account.address);
      setTimeout(() => resolve(), 5000);
    })
    .then(() => {
      console.log("BEFORE FETCH");
      console.log(this.props.account.address);
      return fetch("https://c90vfqfc1l.execute-api.eu-west-1.amazonaws.com/testnet/claim", {
          method: "POST", 
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({
            envelopeAddr: this.props.match.params.addr,
            claimantAddr: this.props.account.address,
          }), 
      })
    })
    .then(response => response.json())
    .then(r => {
      const amount = r.amount;
      if (amount > 0) {
        this.amount = amount;
        this.initing = false;
        this.success = true;
      } else {
        this.initing = false;
        this.success = false;
      }
    })
    .catch(error => {
      this.initing = false;
      this.success = false;
    })
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => resolve(), 10000);
    // }).then(() => {
    //   this.initing = false;
    //   this.success = true;
    // })
  }

  render() {
    console.log(this.props.match.params.addr);
    console.log(this.props.account.address);
    return (
      <AppLayout section="claim">
        <div>
          {this.initing && (
            <div>
              Opening your envelope... <br />
              <img src="https://s3-eu-west-1.amazonaws.com/redenvelope.me/ezgif.com-resize.gif" />
            </div>
          )}
          {(!this.initing && this.success) && (
            <div>
              You got {this.amount} LEAP! <br />
              <img src="https://s3-eu-west-1.amazonaws.com/redenvelope.me/red+envelope4.jpg" />
            </div>
          )}
          {(!this.initing && !this.success) && (
            <div>
              Better luck next time!
              <img src="https://i.kym-cdn.com/photos/images/newsfeed/000/096/044/trollface.jpg?1296494117" />
            </div>
          )}
        </div>
      </AppLayout>
    );
  }
}
