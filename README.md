# freee-slack-notifier

freee 会計 API から未入金の請求書一覧を取得し、Slack に通知する Bot。

本リポジトリは、技術記事「一枚の仕様書から、流れる issue へ ── Linear をエージェントの外部メモリとして使う」のハンズオン成果物です。issue 単位で実装が進められており、Linear 上の 10 issue に対応します。

## 構成

- `src/index.ts` エントリポイント
- `src/freee.ts` freee 会計 API クライアント(未入金請求書一覧取得)
- `src/slack.ts` Slack Incoming Webhook クライアント
- `src/status.ts` 請求書のステータス判定ロジック(純関数)
- `src/status.test.ts` 受け入れテスト

## 前提

- Node.js 20 以上
- freee 会計アプリの OAuth アプリ登録(client id / client secret)
- Slack Incoming Webhook URL

## セットアップ

```bash
pnpm install
cp .env.example .env
# .env を編集して FREEE_* と SLACK_WEBHOOK_URL を埋める
```

## テスト

```bash
pnpm test
```

## 実行

```bash
pnpm start
```

## ライセンス

MIT。`LICENSE` を参照。
