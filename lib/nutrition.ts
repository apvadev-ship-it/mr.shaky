export type CalcInput={weight:number;height:number;age:number;sex:string;goal:string;activity:string;days:number};
export function calculateMacros(v:CalcInput){
 if(!Number.isFinite(v.weight)||v.weight<35||v.weight>250||!Number.isFinite(v.height)||v.height<130||v.height>220||!Number.isFinite(v.age)||v.age<18||v.age>80||v.days<0||v.days>7)return null;
 const rest=10*v.weight+6.25*v.height-5*v.age+(v.sex==='female'?-161:5);
 const activity=v.activity==='high'?1.55:v.activity==='medium'?1.375:1.2;
 const factor=Math.min(1.9,activity+v.days*.025);
 const calories=Math.round(rest*factor+(v.goal==='gain'?250:v.goal==='loss'?-250:0));
 const protein=Math.round(v.weight*(v.goal==='maintain'?1.6:1.8));
 const fat=Math.round(calories*.3/9),carbs=Math.round((calories-protein*4-fat*9)/4);
 return {calories,protein,fat,carbs};
}
export function recommend(routine:string,intensity:string,veggie:boolean){if(veggie)return 'veggie';if(routine==='Descanso')return 'wrap';if(intensity==='Intensa'||routine==='Pierna'||routine==='Full Body')return 'beef';return 'pollo';}
