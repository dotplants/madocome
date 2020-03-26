[目次に戻る](../README.md)

# madocome が処理するユーザーデータについて

madocome では、ログイン以外の全ての処理をブラウザ上で行っており、**私達がデータを収集する事は一切ありません。**  
誰が使用しているのか、何を見ているかという情報を私達は記録する事はできず、また権限を用いてその他のデータにアクセスしたり書き込む事もできません。

これは madocome のソースコードを公開する事で証明しています: [dotplants/madocome](https://github.com/dotplants/madocome)

> なお、ログインのみサーバーに処理させる必要があるのは、OAuth の仕様上によるものです。

# API の権限について

このアプリケーションはほとんどの機能に **YouTube Data API** を使用しています。  
これは、下記の目的でのみ使用し、また認証情報はブラウザにのみ保存され、私たちが読み取ることはできません。

- dotplants.net への権限の付与: これは Google の表示の仕様上のもので、私たちはデータベース等に保管していないため、この認証情報はこのアプリケーションでしか使用できません。
- YouTube 動画、評価、コメント、字幕の表示、編集、完全削除: コメントの取得、投稿に使用します。
- YouTube アカウントの表示: 該当動画の検索に使用します。

# アクセス権の取り消し方法

madocome であなたのアカウントを使用できなくしたい場合、次の二通りの方法があります：

- メニューバーの「ログアウト」ボタンをクリックする (この方法でもアクセス権は削除されます。)
- [Google のセキュリティ設定ページ](https://security.google.com/settings/security/permissions)から、`madocome` のアクセス権を削除する
  ![img](https://i.imgur.com/dQgwfrA.png)

# 連絡先情報 / Contact

メール及び Mastodon、Keybase の DM 上で対応可能です。

- Mail: contact+madocome(at)nzws.me
- Mastodon: [@nzws@don.nzws.me](https://don.nzws.me/@nzws)
- Keybase: [@nzws](https://keybase.io/@nzws)
