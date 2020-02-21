import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getStringData } from './utils/config';

const Block = styled.div(({ theme }) => ({
  padding: '10px',
  margin: '15px',
  background: theme.background,
  color: theme.text,
  width: '700px',
  maxWidth: '95%'
}));

const Code = styled.code({
  display: 'block',
  margin: '10px 0 0 10px',
  fontSize: '0.9rem'
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null
    };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ info });
  }

  render() {
    const { error, info } = this.state;

    if (error) {
      return (
        <Block>
          <b>画面が表示されていませんか？</b>
          <br />
          -
          ページを読み込んでからずっとこの表示の場合、ブラウザやOSが最新であるかご確認ください。なお、EdgeやIEなどでは動かない可能性があります。
          <br />-
          操作中にいきなりここに来た場合、恐らくバグってます。下記の情報を開発者にリプください。
          <Code>
            {error.message}
            <br />
            {info && info.componentStack}
            <br />
            <br />
            conf: {getStringData()}
            <br />
            UA: {navigator.userAgent}
          </Code>
        </Block>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
