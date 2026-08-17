export function ResearchCanvas() {
  return (
    <div className="research-canvas" aria-label="LabID 将分散的科研成果整理为连贯研究脉络的界面示意">
      <div className="canvas-toolbar"><span /><span /><span /><b>Research narrative</b><em>Live</em></div>
      <svg viewBox="0 0 720 450" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="line" x1="0" x2="1"><stop stopColor="#aacdbf"/><stop offset="1" stopColor="#678d7f"/></linearGradient>
        </defs>
        <path className="path path-a" d="M72 335 C168 334 150 126 280 126 S396 260 488 260 576 138 659 122" />
        <path className="path path-b" d="M72 335 C202 358 279 337 348 291 S464 209 659 329" />
        <g className="node node-main" transform="translate(45 306)"><circle cx="28" cy="28" r="28"/><text x="28" y="33">PI</text></g>
        <g className="node" transform="translate(233 92)"><circle cx="35" cy="35" r="35"/><text x="35" y="31">方向 A</text><text className="node-small" x="35" y="47">2018–21</text></g>
        <g className="node" transform="translate(309 254)"><circle cx="35" cy="35" r="35"/><text x="35" y="31">方法 B</text><text className="node-small" x="35" y="47">2020–23</text></g>
        <g className="node node-accent" transform="translate(452 224)"><circle cx="35" cy="35" r="35"/><text x="35" y="31">发现 C</text><text className="node-small" x="35" y="47">2024</text></g>
        <g className="node" transform="translate(618 82)"><circle cx="34" cy="34" r="34"/><text x="34" y="31">方向 D</text><text className="node-small" x="34" y="46">Now</text></g>
        <g className="node" transform="translate(624 294)"><circle cx="34" cy="34" r="34"/><text x="34" y="31">协作 E</text><text className="node-small" x="34" y="46">Now</text></g>
      </svg>
      <div className="canvas-note"><span>AI 整理建议</span><p>“方向 A”与“发现 C”之间存在连续的问题演进，可合并为一条研究主线。</p><button type="button" tabIndex={-1}>查看脉络</button></div>
    </div>
  );
}
