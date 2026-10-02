import ShakyApp from '../shaky-app';
import {notFound} from 'next/navigation';
import {nav,routes} from '../data';
export function generateStaticParams(){return nav.map(([section])=>({section}))}
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!routes.includes(section))notFound();return <ShakyApp/>}
