# Polymarket Data Atlas v1

Data Atlas v1 是当前 Polymarket 数据审计的公开网页与离线入口。它使用已验收的 P1B 全量
多尺度数据，直接回答五个问题：

- 数据包含多少事件、时间点以及多大的时间跨度；
- 每个事件包含哪些字段，单条轨迹是什么形式；
- 不同轨迹的长度、采样频率和数据量如何分布；
- 七个代表案例分别揭示什么数据结构与建模边界；
- 原始 JSON / parquet 记录如何转成统一的 history / target 样本；
- 当前能够和不能声称的研究边界。

公开地址：

https://economicworldmodel.github.io/

网页入口设有前端协作口令，并在当前浏览器会话中保持解锁。该口令只限制普通浏览流程；
由于站点仍由公开的 GitHub Pages 静态托管，网页源码和紧凑数据载荷仍可被直接访问。

也可以直接打开 [`index.html`](index.html) 离线浏览，或运行：

```bash
cd outputs/polymarket_data_atlas_v1
python -m http.server 8765
```

然后访问 `http://localhost:8765/`。

## 数据边界

网页只保存浏览所需的紧凑摘要和降采样轨迹，不复制亿级 bars。完整数据仍位于：

```text
runs/polymarket_p1b_multiscale_v0/
runs/polymarket_p1b_hourly_v0/
runs/polymarket_fast_dataset_v0/
```

早期 Track A pilot 只用于验证样本形状；正式 A-H/A-D/A-S 数据集和确定性简单
baseline 已经完成。P2 当前只有 lexical/calendar seed，P3 尚未开始。

## 重建数据载荷

```bash
PYTHONPATH=src python -m econwm.eval.build_polymarket_data_atlas_v1 \
  --p1b-root runs/polymarket_p1b_multiscale_v0 \
  --pilot-root runs/polymarket_fast_dataset_v0 \
  --out-dir outputs/polymarket_data_atlas_v1
```

网页只发布浏览所需的紧凑摘要；研究文档和完整数据仍保留在私有项目仓库中。
