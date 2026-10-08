# sing-box 内核

本项目只启动 sing-box。`v2ray.core` 模块名保留用于兼容已有界面和订阅代码，不再启动 Xray 或其他辅助内核。

将 Windows 版内核放在发布目录的 `sing-box/sing-box.exe`，或发布目录下的 `sing-box.exe`。开发时对应 `WinXray/sing-box/sing-box.exe`。

启动时生成 `sing-box-config.json`，执行 `sing-box check -c` 校验，再执行 `sing-box run -c`。原有 `config.json` 不再加载。停止只关闭本程序持有的进程；程序退出通过 Windows Job Object 清理内核。

首页“点我启动”不检测联网状态。日志中的“已启动”只代表内核运行；访问网站后可查看节点连接错误。“测延时并连接”保留联网检测。

## 配置迁移

内部节点表和订阅解析沿用已有格式。支持映射 VLESS、VMess、Trojan、Shadowsocks（含 SS 2022）、SOCKS、HTTP/HTTPS、TUIC、Hysteria/Hysteria2、Naive。具体功能还取决于 sing-box 的构建选项。

SSR、Trojan-Go、旧 XTLS、KCP/QUIC 传输、自定义 TCP headerType 等不做静默降级，启动时明确报错。Hysteria2 端口跳跃、特殊混淆和 REALITY ML-DSA 字段目前需要另行适配。

保存的旧 Xray 模板会尝试转换：本地入站端口、常用域名/IP/端口规则、直连和阻断规则。原模板保存在 `core.table` 的 `legacyXrayText`。无法转换的旧 DNS 或复杂路由会要求手动迁移，而不是忽略。

GeoIP/Geosite 规则改用 SagerNet 的远程 `.srs` 规则集。首次启动需要下载；启动受网络影响时，可在 sing-box 模板中改为本地规则集。原 `.dat` 文件不再使用。

自定义内核模板应采用 sing-box 格式，并保留 `proxy` / `http_proxy` 两个入站标签和 `proxy` 出站标签。应用负责覆盖本地端口和选中节点；其他原生配置会保留。

## 验证

在 aardio 中运行项目根目录的 `protocol-tests.aardio`，测试分享链接解析、协议配置生成、旧模板迁移，并调用本地 sing-box 对生成配置进行离线校验。

重新编译前退出旧 WinXray。首次启动后检查日志中的内核路径和端口，并验证系统代理、PAC、启动停止、局域网监听和退出后的端口释放。
