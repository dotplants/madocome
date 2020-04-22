import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';

import { ColorBlock, Right, StyledMenu } from './styles';
import { MenuHr, MenuItem } from '../menu';
import Icon from '../icon';
import Container from '../../container';
import { getConfig } from '../../utils/config';
import ExternalLink from '../external-link';

const VideoDetails = styled.div({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
});

const Link = styled(ExternalLink)({
  color: ({ theme: { text } }) => text
});

const langs = {
  ja: '日本語',
  en: 'English (WIP)'
};

const Config = ({ toggleMenuOpened, removeVideo, liveDetails }) => {
  const { formatMessage } = useIntl();
  const { videos, conf, setConf, addVideo } = Container.useContainer();
  const details = JSON.parse(liveDetails);

  const logOut = () => {
    const accept = confirm(
      formatMessage({ id: 'components.footer.log_out.desc' })
    );
    if (!accept) {
      return;
    }
    const token = getConfig('access_token', 'live_token');
    fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(({ error }) => {
        if (error) {
          alert(formatMessage({ id: 'components.footer.log_out.failed' }));
        }
        localStorage.removeItem('live_token');

        location.reload();
      });
  };

  return (
    <StyledMenu>
      <MenuItem onClick={toggleMenuOpened}>
        <Icon icon="times" />{' '}
        <FormattedMessage id="components.side.menu.done" />
      </MenuItem>

      <MenuHr />

      <MenuItem noHover>
        <Right>
          <select
            id="language"
            value={conf.language}
            onChange={e => setConf('language', e.target.value)}
          >
            <option value="">
              {formatMessage({ id: 'components.side.menu.language_default' })}
            </option>
            {Object.keys(langs).map(key => (
              <option value={key} key={key}>
                {langs[key]}
              </option>
            ))}
          </select>
        </Right>
        <Icon icon="language" /> Language
      </MenuItem>

      <MenuItem
        onClick={() => window.open(location.href, null, 'width=450,height=700')}
      >
        <Icon icon="external-link-alt" />{' '}
        <FormattedMessage id="components.side.menu.open_window" />
      </MenuItem>

      <MenuHr />

      <MenuItem onClick={() => addVideo(formatMessage)}>
        <Icon icon="plus" /> <FormattedMessage id="components.side.menu.add" />
      </MenuItem>

      {videos.map(video => (
        <MenuItem key={video.id} noHover>
          <Right style={{ paddingLeft: '5px' }}>
            <span
              title={formatMessage({
                id: 'components.side.menu.videos.viewers'
              })}
            >
              <Icon icon="users" style={{ marginRight: '3px' }} />
              {details[video.id]?.viewers || '?'}
            </span>{' '}
            <Icon
              icon="power-off"
              title={formatMessage({
                id: 'components.side.menu.videos.delete'
              })}
              onClick={() => removeVideo(video)}
            />
          </Right>
          <VideoDetails>
            <ColorBlock
              bg={video.color}
              title={formatMessage({ id: 'components.side.menu.videos.color' })}
            />{' '}
            <Link
              href={`https://youtu.be/${video.id}`}
              title={formatMessage({
                id: 'components.side.menu.videos.get-link'
              })}
            >
              <b>{details[video.id]?.channel || '...'}</b>
            </Link>
          </VideoDetails>
        </MenuItem>
      ))}

      <MenuHr />

      <MenuItem noHover>
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
      <MenuItem noHover>
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

      {getConfig('access_token', 'live_token') && (
        <>
          <MenuHr />
          <MenuItem onClick={logOut}>
            <Icon icon="sign-out-alt" />{' '}
            <FormattedMessage id="components.side.menu.logout" />
          </MenuItem>
        </>
      )}

      <MenuHr />
      <MenuItem noHover>
        <b>
          <FormattedMessage id="components.side.menu.about.title" />
        </b>
      </MenuItem>

      <MenuItem
        onClick={() =>
          window.open('https://github.com/dotplants/madocome/blob/master/docs')
        }
      >
        <FormattedMessage id="components.side.menu.about.help" />
      </MenuItem>
      <MenuItem
        onClick={() =>
          window.open(
            'https://github.com/dotplants/madocome/blob/master/docs/ja/privacy-policy.md'
          )
        }
      >
        <FormattedMessage id="components.side.menu.about.privacy" />
      </MenuItem>
      <MenuItem onClick={() => window.open('https://nzws.me/')}>
        Created by @nzws_me with 💖
      </MenuItem>
    </StyledMenu>
  );
};

Config.propTypes = {
  toggleMenuOpened: PropTypes.func.isRequired,
  removeVideo: PropTypes.func.isRequired,
  liveDetails: PropTypes.string
};

export default Config;
