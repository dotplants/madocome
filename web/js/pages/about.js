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
    窓米では、ほとんどの機能に<b>YouTube Data API</b>を使用しています。
    <br />
    これは、下記の目的でのみ使用し、また、認証情報はブラウザに保存され、私たちはデータベースなどに保存していません。
    <br />
    なお、窓米のソースコードは
    <ExternalLink href="https://github.com/dotplants/madocome">
      こちら
    </ExternalLink>
    で公開しており、GitHub上から直接ZEIT Nowに展開しています。
    <ul>
      <li>
        dotplants.net への権限の付与:
        これはGoogleの表示の仕様上のもので、私たちはデータベースに保管していないため、窓米にしか使用できません。
      </li>
      <li>
        YouTube 動画、評価、コメント、字幕の表示、編集、完全削除:
        コメントの取得、投稿に使用します。
      </li>
      <li>YouTube アカウントの表示: 該当動画の検索に使用します。</li>
    </ul>
  </Container>
);

export default About;
