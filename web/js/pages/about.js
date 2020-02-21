import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import ExternalLink from '../components/external-link';

const Container = styled.div({
  padding: '20px 20%',
  '@media screen and (max-width: 1000px)': {
    padding: '10px 5%'
  }
});

const ImageWrapper = styled.div({
  margin: '20px 0',
  textAlign: 'center'
});

const Image = styled.img({
  display: 'block',
  maxWidth: '100%'
});

const About = () => (
  <Container>
    <Link to="/">トップに戻る</Link>
    <h1>窓米 - madocome -</h1>
    <b>コメントをまとめて見ることができる</b>YouTube Liveの窓ツールです。
    <ExternalLink href="https://github.com/dotplants/madocome/blob/master/docs/">
      使い方などはこちら
    </ExternalLink>
    <ImageWrapper>
      <Image src="https://i.imgur.com/KKJiL0T.png" />
    </ImageWrapper>
    <i>
      画像のライセンスは
      <ExternalLink href="https://github.com/dotplants/madocome#license">
        こちら
      </ExternalLink>
    </i>
    <hr />
    <h2>権限について</h2>
    <ExternalLink href="https://github.com/dotplants/madocome/blob/master/docs/ja/api-permission.md">
      こちらのドキュメント
    </ExternalLink>
    に移動しました。
  </Container>
);

export default About;
