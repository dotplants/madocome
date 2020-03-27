import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ColorBlock, StyledMenu } from './styles';
import { MenuHr, MenuItem } from '../menu';
import Icon from '../icon';
import Container from '../../container';

const Config = ({
  toggleMenuOpened,
  addCommentGetter,
  removeCommentGetter
}) => {
  const { videos, conf, setConf } = Container.useContainer();

  return (
    <StyledMenu>
      {videos.map(video => (
        <MenuItem
          onClick={() =>
            video.hideComment
              ? addCommentGetter(video, true)
              : removeCommentGetter(video)
          }
          key={video.id}
        >
          <Icon icon={!video.hideComment ? 'check-square' : 'square'} />{' '}
          <ColorBlock bg={video.color} />{' '}
          <FormattedMessage id="components.side.menu.recive" />
        </MenuItem>
      ))}
      {!videos[0] && (
        <MenuItem>
          <small>
            <FormattedMessage id="components.side.menu.note" />
          </small>
        </MenuItem>
      )}

      <MenuHr />
      <MenuItem>
        <b>
          <FormattedMessage id="components.side.menu.display.title" />
        </b>
        <br />
        <small>
          <FormattedMessage id="components.side.menu.display.note" />
        </small>
      </MenuItem>

      <MenuItem onClick={() => setConf('hide_username', !conf.hide_username)}>
        <Icon icon={conf.hide_username ? 'check-square' : 'square'} />{' '}
        <FormattedMessage id="components.side.menu.hide_username" />
      </MenuItem>
      <MenuItem onClick={() => setConf('hide_longtext', !conf.hide_longtext)}>
        <Icon icon={conf.hide_longtext ? 'check-square' : 'square'} />{' '}
        <FormattedMessage id="components.side.menu.hide_longtext" />
      </MenuItem>

      <MenuHr />
      <MenuItem>
        <b>
          <FormattedMessage id="components.side.menu.show_user.title" />
        </b>
        <br />
        <small>
          <FormattedMessage id="components.side.menu.show_user.note" />
        </small>
      </MenuItem>

      {['owner', 'mod', 'verified', 'sponsor', 'anonymous'].map(id => (
        <MenuItem
          key={id}
          onClick={() => setConf(`hide_${id}`, !conf[`hide_${id}`])}
        >
          <Icon icon={conf[`hide_${id}`] ? 'square' : 'check-square'} />{' '}
          <FormattedMessage id={`components.side.menu.show_user.${id}`} />
        </MenuItem>
      ))}
      <MenuHr />
      <MenuItem onClick={toggleMenuOpened}>
        <Icon icon="door-closed" />{' '}
        <FormattedMessage id="components.side.menu.done" />
      </MenuItem>
    </StyledMenu>
  );
};

Config.propTypes = {
  toggleMenuOpened: PropTypes.func.isRequired,
  addCommentGetter: PropTypes.func.isRequired,
  removeCommentGetter: PropTypes.func.isRequired
};

export default Config;
