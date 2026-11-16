# NetPractice

## English

Ten network-configuration exercises about IP addresses, subnet masks, switches, routers, and gateways. The JSON files record settings entered in the supplied training interface.

### Layout

| Path | Contents |
| --- | --- |
| `level1.json–level10.json` | One exported configuration per level |
| `net_practice/` | Training interface and network simulator |
| `tests/check_levels.js` | Replay settings through the original simulator |

### Run and test

Tests require Node.js and Make. Practice requires Python 3 and a browser. Run from the repository root.

```sh
make test
python3 -m http.server 49242 --directory net_practice
```

Open `http://localhost:49242` to practice with your own login. `make test` uses the fixed board seed saved with these configurations to regenerate each board, applies the exported settings, and verifies all 31 communication goals across ten levels. Browser interaction and timed evaluation are separate.

See [the detailed guide](docs/GUIDE.md) for the original setup and implementation notes.

## 日本語

IPアドレス・サブネットマスク・スイッチ・ルーター・ゲートウェイを学ぶ、10段階のネットワーク設定課題です。配布された練習画面に入力した設定をJSONで保存しています。

### 構成

| パス | 内容 |
| --- | --- |
| `level1.json–level10.json` | 各レベルの設定データ |
| `net_practice/` | 配布された練習画面と判定処理 |
| `tests/check_levels.js` | 保存済み設定を判定処理へ適用するテスト |

### 実行とテスト

テストにはNode.js・Make、練習画面にはPython 3とブラウザが必要です。 リポジトリ直下で実行します。

```sh
make test
python3 -m http.server 49242 --directory net_practice
```

`http://localhost:49242` を開き、自分のログイン名で練習できます。`make test` は保存済み設定に対応する固定シードで各盤面を再生成し、JSONの設定を適用して、10レベル・31件の通信目標を検証します。ブラウザ操作と時間制限付き評価は別途確認します。

元の構築手順と設計の説明は[詳細ガイド](docs/GUIDE.md)にまとめています。
