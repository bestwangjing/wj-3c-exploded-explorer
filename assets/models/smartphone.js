import * as THREE from './vendor/three.module.js';
import {createBuilder} from './geometry-kit.js';
export const categories=[
 {id:'shell',name:'机身与防护',en:'HOUSING',color:'#a5bfc5',material:'铝合金 / 玻璃（示意）',desc:'中框、后盖与密封结构构成手机的机械边界。',offset:[0,0,-5],xray:true},
 {id:'display',name:'显示与触控',en:'DISPLAY',color:'#82bce6',material:'玻璃 / 显示材料',desc:'独立展示屏幕盖板、触控层、显示层和支撑板。',offset:[0,0,7]},
 {id:'board',name:'主板与计算',en:'MAINBOARD',color:'#71cda9',material:'FR-4 / 半导体',desc:'处理器、存储、射频与供电电路组成信号处理核心。走线为示意。',offset:[0,.3,.6]},
 {id:'optics',name:'摄像与传感',en:'CAMERAS',color:'#b1a6ee',material:'玻璃 / 硅 / 金属',desc:'摄像头按传感器、支架、镜组与保护玻璃拆分，光学参数为概念设计。',offset:[-3,.8,-6.5]},
 {id:'power',name:'电池与供电',en:'POWER',color:'#e2d38c',material:'电芯 / 铝塑膜',desc:'电芯与保护电路构成供电模块，未声明真实容量或电压。',offset:[-9.5,-.8,1.2]},
 {id:'thermal',name:'散热与屏蔽',en:'THERMAL',color:'#e8bd8e',material:'铜 / 石墨 / 金属',desc:'均热层、导热垫与屏蔽罩隔开热量和信号影响。',offset:[.3,0,2.1],xray:true},
 {id:'io',name:'声学与连接',en:'I/O & AUDIO',color:'#91cbbf',material:'金属 / 塑料 / 柔性电路',desc:'扬声器、振动模块、接口、天线与排线连接各个子系统。',offset:[2.2,-.6,.2]},
 {id:'hardware',name:'紧固与定位',en:'FASTENERS',color:'#98aab5',material:'不锈钢 / 铜合金',desc:'紧固件和支柱负责结构定位。',offset:[0,0,-1]},
];
export function createModel(){const b=createBuilder(categories);
 b.add('shell','一体承力中框','Phone chassis',b.plate(6.9,14.2,.72,.6,[{w:6.48,h:13.78,r:.42}]),'shell',[0,0,0],[0,0,0]);
 const back=b.add('shell','后部保护盖','Rear cover',b.plate(6.83,14.12,.12,.59,[{w:2.45,h:3.55,x:-1.66,y:4.65,r:.3}]),'shell',[0,0,-.43],[0,0,-1.2]);b.label(back,'CONCEPT / P',2.8,.7,[0,-4.5,-.066]);
 b.add('shell','周向密封胶框','Perimeter adhesive',b.plate(6.58,13.92,.025,.5,[{w:6.41,h:13.73,r:.4}]),'rubber',[0,0,.4],[0,0,.4]);
 for(let i=0;i<3;i++)b.box('shell',['音量加按键','音量减按键','电源按键'][i],'Side key',.1,.7,.25,'metal',[i===2?3.49:-3.49,2.3-i*.85,0],[i===2?.8:-.8,0,0]);
 for(let i=0;i<4;i++)b.box('shell',`边框天线隔断 ${i+1}`,'Antenna break',.24,.11,.74,'rubber',[i%2?2.7:-2.7,i<2?7.13:-7.13,0],[0,i<2?.45:-.45,0]);
 const layers=[['显示支撑背板','Display support','metal',.12,.47,-.75],['柔性显示面板','Display panel','dark',.04,.56,0],['透明触控感应层','Touch digitizer','glass',.025,.62,.7],['屏幕盖板玻璃','Cover glass','glass',.07,.69,1.4]];
 layers.forEach(([n,en,m,d,z,e],i)=>{const p=b.box('display',n,en,6.46,13.68,d,m,[0,0,z],[0,0,e]);if(i===1)b.screen(p,6.34,13.54,[0,0,.023]);});
 b.box('display','显示排线','Display flex',.52,1.7,.025,'flex',[2.15,-2,.35],[1.1,-.5,-.25]);b.box('display','显示驱动芯片','Display driver',.65,.25,.08,'chip',[0,-6.4,.48],[0,-.7,.2]);
 const pcb=b.box('board','主逻辑电路板','Main logic board',5.75,3.7,.12,'pcb',[0,4.3,.02],[0,0,0]);b.circuit(pcb,5.75,3.7);
 const chips=[['应用处理器','APPLICATION',1.1,1.1,.55,4.6],['运行内存','MEMORY',.95,.7,1.8,4.7],['闪存封装','STORAGE',.85,.8,.55,3.2],['电源管理芯片','PMIC',.55,.55,1.75,3.3],['射频收发器','RF',.6,.6,-.8,4.8],['无线连接芯片','WIRELESS',.6,.65,-1.7,3.1],['音频编解码器','AUDIO',.45,.4,-.6,3.3],['惯性测量单元','IMU',.3,.3,2.3,5.55]];
 chips.forEach(([n,en,w,h,x,y],i)=>{const p=b.box('board',n,en,w,h,.11,'chip',[x,y,.15],[x*.08,.15,.5+(i%3)*.25],{role:'电信号处理'});b.label(p,en,w*.9,h*.8,[0,0,.058]);for(let j=0;j<7;j++)b.child(p,new THREE.BoxGeometry(.035,.07,.025),'metal',[-w*.4+j*w*.13,-h*.5-.03,0]);});
 b.passives('board',[-2.55,5.65,.14],14,2,.35);b.passives('board',[-2.45,2.67,.14],12,1,.38);
 for(let i=0;i<3;i++)b.box('board',`电源电感 ${i+1}`,'Power inductor',.3,.28,.2,'dark',[1.2+i*.48,2.9,.15],[.1,0,.4]);
 const battery=b.box('power','锂离子电芯','Battery cell',5.65,7.4,.36,'metal',[0,-1.7,.03],[0,0,0]);b.label(battery,'BATTERY',4.3,2.7,[0,0,.185]);b.box('power','电池保护电路板','Battery protection',4.8,.32,.06,'pcb',[0,2.17,.05],[0,.65,.3]);b.box('power','电池绝缘膜','Battery insulator',5.7,7.45,.018,'rubber',[0,-1.7,.23],[0,0,.7]);b.box('power','电池缓冲背垫','Cell cushion',5.4,7.1,.04,'rubber',[0,-1.7,-.18],[0,0,-.7]);b.box('power','电池连接排线','Battery flex',.45,1.2,.025,'flex',[2.5,2.1,.13],[.5,.7,.5]);
 for(let i=0;i<4;i++)b.box('power',`电池连接触点 ${i+1}`,'Battery contact',.15,.2,.05,'gold',[-.35+i*.24,2.38,.11],[0,.9,.2]);
 for(let k=0;k<3;k++){const x=k===2?-.85:-2.1,y=k===0?5.65:4.23;const prefix=['主摄','广角摄像头','辅助摄像头'][k];b.box('optics',prefix+'基板','Camera PCB',1.07,1.07,.07,'pcb',[x,y,-.15],[k*.2,0,.9]);b.box('optics',prefix+'感光芯片','Image sensor',.62,.62,.045,'sensor',[x,y,-.23],[k*.2,0,.5]);b.add('optics',prefix+'镜筒','Camera barrel',b.ring(.48,.35,.3),'dark',[x,y,-.5],[k*.2,0,-.3]);for(let j=0;j<4;j++){b.add('optics',`${prefix}镜片 ${j+1}`,'Lens element',b.disk(.32-j*.025,.035),'glass',[x,y,-.38-j*.08],[k*.2,0,-.7-j*.35]);if(j<3)b.add('optics',`${prefix}间隔环 ${j+1}`,'Lens spacer',b.ring(.36-j*.025,.3-j*.025,.025),'dark',[x,y,-.42-j*.08],[k*.2,0,-.85-j*.35]);}b.add('optics',prefix+'保护玻璃','Camera cover',b.disk(.48,.045),'glass',[x,y,-.83],[k*.2,0,-2.3]);}
 b.add('optics','前置自拍模组','Front camera',b.disk(.22,.16),'dark',[0,6.3,.38],[2,0,1.4]);
 b.box('thermal','主板电磁屏蔽罩','EMI shield',3.6,3.1,.04,'metal',[.7,4.3,.27],[0,.2,.3]);b.box('thermal','铜质均热板','Vapor spreader',5.45,10.7,.06,'copper',[0,.1,.3],[0,0,0]);b.box('thermal','石墨散热薄膜','Graphite film',5.4,10.6,.015,'rubber',[0,.1,.35],[0,0,.5]);b.box('thermal','处理器导热垫','Thermal pad',1.25,1.25,.04,'thermal',[.55,4.6,.22],[0,.2,-.4]);
 b.box('io','底部扬声器模组','Bottom speaker',2.3,.7,.42,'dark',[-1.65,-6.2,.02],[-.2,-1,.1]);b.box('io','线性振动模块','Haptic motor',1.6,.7,.35,'metal',[1.6,-6.2,.02],[.3,-1.1,.1]);b.box('io','听筒声学单元','Earpiece',1.4,.25,.22,'dark',[.9,6.55,.05],[.5,.7,0]);const sub=b.box('io','充电接口子板','Charging daughterboard',2.7,.8,.09,'pcb',[0,-5.7,-.05],[0,-.4,0]);b.circuit(sub,2.7,.8);
 b.box('io','USB-C 接口','USB-C port',.9,.25,.4,'metal',[0,-6.9,.05],[0,-1.3,0]);b.box('io','主板连接柔性排线','Interconnect flex',.5,6.5,.03,'flex',[2.7,-1.8,.28],[.9,0,.4]);
 for(let i=0;i<3;i++)b.add('io',`麦克风 ${i+1}`,'MEMS microphone',b.disk(.12,.1),'metal',[-2+i*1.8,-6.8,.1],[0,-.9,.35]);for(let i=0;i<2;i++)b.box('io',`天线柔性线路 ${i+1}`,'Antenna flex',.18,2.3,.025,'flex',[i?3.15:-3.15,0,.05],[i?.8:-.8,0,.2]);
 for(let i=0;i<16;i++)b.screw('hardware',`中框固定螺丝 ${i+1}`,[i%2?3.15:-3.15,-6.4+Math.floor(i/2)*1.8,.32],[i%2?.45:-.45,0,.8]);
 return b.finish();}
