/**
 * Copyright (c) 2018-present, Leap DAO (leapdao.org)
 *
 * This source code is licensed under the GNU GENERAL PUBLIC LICENSE Version 3
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from 'react';
import { observer } from 'mobx-react';
import AppLayout from '../../components/appLayout';
import { CONFIG } from '../../config';

@observer
export default class Home extends React.Component {
  render() {
    return (
      <AppLayout section="home">
        <div style={{ maxWidth: '500px' }}>

          <h1>RED ENVELOPE ME</h1>
          <p>
            Red Envelope is a gifting app. By using the Status.im chat you can gift to anyone in an instant.
            The catch is the Red Envelope gives you all of the gift, some of the gift or no gift at all. Try your luck on
            the app.
          </p>
          <img src="https://s3-eu-west-1.amazonaws.com/redenvelope.me/qrcode.png" />
          <p>
             Instructions: <br/>
             1.) Scan QR code with Status app <br/>
             2.) Select "Open in Status"
          </p>

        </div>
      </AppLayout>
    );
  }
}