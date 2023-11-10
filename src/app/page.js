import Image from 'next/image'
import Sidebar from '@/components/Sidebar';


export default function Home() {
  return (
    <>
    <div className="grid grid-cols-5 h-screen mr-5">
        <div className="col-span-1">
            <Sidebar />
        </div>
        <div className="col-span-4">
                        <div className="w-1/3 mr-10">
                <div className="flex flex-col items-left justify-left py-2">
                    <h1 className="text-2xl font-bold inline-block">
                        AAAA
                    </h1>
                </div>
                <div className="flex flex-col items-left justify-left py-2">
                    Mucho texto
                </div>
            </div>                
            
        </div>
    </div>
</>
  )
}
