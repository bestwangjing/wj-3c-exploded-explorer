# 通用模型接口

`dist/model.js` 导出 `categories` 和 `createModel()`。交互层不依赖具体产品。

```javascript
import {createBuilder} from './geometry-kit.js';
export const categories = [
  {id:'shell',name:'外壳',en:'HOUSING',color:'#a5bfc5',material:'铝合金（示意）',desc:'保护内部结构。',offset:[0,0,3],xray:true},
  {id:'board',name:'主板',en:'MAINBOARD',color:'#71cda9',material:'FR-4',desc:'连接电路。',offset:[0,0,0]},
];
export function createModel(){
  const b=createBuilder(categories);
  b.box('shell','后盖','Rear cover',6,10,.15,'shell',[0,0,-1],[0,0,-1]);
  b.box('board','主板','Main PCB',4,5,.08,'pcb',[0,0,0],[0,0,0]);
  return b.finish();
}
```

这只是接口示例，不能作为完整产品交付。

## Geometry Builder

- `box(cat,name,en,w,h,d,material,home,detail=[],extra={})`：圆角块，返回零件。
- `add(cat,name,en,geometry,material,home,detail=[],extra={})`：任意几何零件。
- `plate(w,h,d,r,holes)`：XY 板沿 Z 挤出，孔为 `{w,h,x,y,r}` 或 `{type:'circle',x,y,r}`。
- `ring(ro,ri,depth)`、`disk(radius,depth)`：轴向为 Z 的环和圆柱。
- `child(part,geometry,material,position)`：装饰子网格，不新增计数。
- `label(part,text,w,h,position,foreground,background)`：程序化文字贴图。
- `screen(part,w,h,position,flip)`：程序化屏幕纹理，背面显示时 flip=true。
- `circuit(part,w,h)`：装饰铜走线和焊盘。
- `passives(cat,origin,columns,rows,spacing)`：独立贴片元件。
- `screw(cat,name,position,detail,extra)`：包含头部、槽与轴的一个零件。
- `fan(cat,name,position,radius,detail,extra)`：一个转子零件，叶片作为子网格。
- `finish()`：记录材质初始状态，返回 `{root,parts,byId}`。

材料键：shell/dark/rubber/metal/copper/gold/pcb/chip/ceramic/glass/sensor/flex/thermal/red。

extra 可含 spread:[x,y,z]、rotation:[x,y,z]、role、desc、material、size。单位是概念模型单位；无依据时不要将其当实测毫米。

每个零件有 id,name,en,cat,group,mesh,home,spread,detail,role,material,size,desc。home/spread/detail 为 Vector3，group.userData.partId 用于拾取。根节点不要再整体变换，以免破坏坐标恢复与聚焦逻辑。

分类 offset 为模块位移，detail 为细部位移；分类 xray=true 指定透视时变透明的结构。分类可用 anchorName 指定标签锚点，未指定则取首个零件。

`dist/product.js` 导出 product：name/code/english/intro/openingCategory/amount/viewDirection。计数自动计算。自定义产品必须同时替换模型和文案，再实际验证。
