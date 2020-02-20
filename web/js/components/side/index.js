import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import Container from '../../container';
import { getConfig } from '../../utils/config';
import Icon from '../icon';
import Alert from '../alert';
import Comment from '../comment';
import Post from './post';
import { Side, Selector, Right, Comments } from './styles';
import Config from './config';

const Sidebar = () => {
  const { videos, conf } = Container.useContainer();
  const [comments, setComments] = useState([]);
  const [menuOpened, setMenuOpened] = useState(false);
  const token = getConfig('access_token', 'live_token');

  const toggleMenuOpened = () => setMenuOpened(prev => !prev);

  return (
    <Side isHide={conf.hide_side}>
      {menuOpened && (
        <Config toggleMenuOpened={toggleMenuOpened} setComments={setComments} />
      )}

      <Selector onClick={toggleMenuOpened}>
        <Right>
          <Icon icon="caret-down" />
        </Right>

        <b>
          <FormattedMessage id="title" />
        </b>
      </Selector>

      <Comments>
        {!token && (
          <Alert>
            <FormattedMessage
              id="components.side.please_login"
              values={{
                login: (
                  <a href="/api/auth-login">
                    <FormattedMessage id="components.side.login" />
                  </a>
                )
              }}
            />
          </Alert>
        )}
        {token &&
          comments
            .map((comment, key) => (
              <Comment comment={comment} key={comment.id || key} conf={conf} />
            ))
            .filter((v, i) => i < 150)}
      </Comments>

      <Post videos={videos} />
    </Side>
  );
};

export default Sidebar;
