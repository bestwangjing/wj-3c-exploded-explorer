"""Create an independent product explorer from bundled, credential-free assets."""
from pathlib import Path
import argparse,json,re,shutil,sys
if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')

SKILL=Path(__file__).resolve().parents[1]
PROFILES={
 'smartphone':dict(code='P-01',english='SMARTPHONE',openingCategory='optics',amount=.8,viewDirection=[2.5,.65,1.45],intro='从显示叠层到微小元件，逐层探索手机的内部结构。'),
 'laptop':dict(code='L-01',english='LAPTOP',openingCategory='keyboard',amount=.82,viewDirection=[1.15,1.1,1.9],intro='从每颗键帽到主板与散热，探索一台笔记本的精密装配。'),
 'desktop':dict(code='D-01',english='DESKTOP COMPUTER',openingCategory='board',amount=.78,viewDirection=[1.25,.65,2.1],intro='从机箱框架到处理器与扩展板卡，探索桌面电脑的装配关系。'),
 'camera':dict(code='A-01',english='ACTION CAMERA',openingCategory='optics',amount=.88,viewDirection=[1.65,.85,1.35],intro='从第一片镜片到最后一颗螺丝，探索运动相机的内部秩序。'),
 'custom':dict(code='C-01',english='DIGITAL PRODUCT',openingCategory='',amount=.82,viewDirection=[1.5,.85,1.8],intro='逐层探索产品的机械、电子与交互结构。'),
}
def infer(name):
 if re.search(r'台式|主机|desktop|tower',name,re.I):return 'desktop'
 if re.search(r'笔记本|电脑|laptop|notebook|macbook',name,re.I):return 'laptop'
 if re.search(r'手机|smartphone|iphone',name,re.I):return 'smartphone'
 if re.search(r'运动相机|action\s*camera|gopro',name,re.I):return 'camera'
 # A generic camera can have a very different form; the author must choose explicitly.
 return 'custom'
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--product',required=True);ap.add_argument('--output',required=True);ap.add_argument('--profile',choices=PROFILES);ap.add_argument('--model-file');args=ap.parse_args()
 profile=args.profile or infer(args.product);out=Path(args.output).expanduser().resolve()
 if not args.product.strip():ap.error('product must not be empty')
 if out.exists() and (not out.is_dir() or any(out.iterdir())):ap.error('Output must be a new or empty directory; existing work is never overwritten.')
 if out==SKILL or SKILL in out.parents:ap.error('Write generated projects outside the installed skill directory.')
 if profile=='custom' and not args.model_file:ap.error('This product needs its own model. Create model.js using references/model-contract.md, then pass --profile custom --model-file <path>. No camera fallback is used.')
 model=Path(args.model_file).resolve() if args.model_file else SKILL/'assets/models'/f'{profile}.js'
 if not model.is_file():ap.error('Model file does not exist')
 shutil.copytree(SKILL/'assets/starter',out,dirs_exist_ok=True)
 shutil.copy2(model,out/'dist/model.js')
 config={'name':args.product.strip(),**PROFILES[profile]}
 (out/'dist/product.js').write_text('export const product = '+json.dumps(config,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
 text=f'# {args.product} · 3D 拆解实验室\n\n这是概念结构，不是厂商 CAD 或维修图纸。\n\n安装 Node.js 后运行 `node serve.mjs`，打开打印的本地地址。Windows 也可双击“启动页面.cmd”。需要保留启动窗口。不要直接双击 HTML。\n\n左键旋转、滚轮缩放、右键平移；滑块连续拆装；点击零件查看功能与隔离。快捷键：空格演示，R 重置，X 透视，L 标签，G 网格，Esc 返回。\n\n全部 Three.js 依赖随包提供，无需 CDN。修改 dist/model.js 调整结构，dist/product.js 调整名称、介绍和默认视角。\n\n当前目录为未验收生成稿；请按 Skill 中的验证流程检查后再交付。\n'
 (out/'使用说明.md').write_text(text,encoding='utf-8')
 print(json.dumps({'output':str(out),'profile':profile,'product':args.product,'entry':'dist/index.html','start':'node serve.mjs','status':'generated_unverified'},ensure_ascii=False))
if __name__=='__main__':main()
