"use client"
import { FadeText } from '@src/components/ui/fade-text';
import { ApiKeyPanel } from '../../../components/ui/api-key-panel';
import chromeSvg from '@assets/chrome.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
export const Guide = () => {

    const router = useRouter()
    return (<a
        id="how-to-use"
    >
        <div className="w-full bg-[aliceblue]  pb-10 lg:pb-32">
            <div className="relative z-20 pt-10 lg:pt-32  max-w-7xl mx-auto">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                    How to  use
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                    Beyond browser bookmarks: Organize anything from the internet for easy rediscovery
                </p>
            </div>
            <div className="flex flex-col justify-start space-y-12 text-center ">
                <FadeText
                    className="text-5xl font-bold text-black dark:text-white"
                    direction="up"
                    framerProps={{
                        show: { transition: { delay: 0.2 } },
                    }}
                    text={<div className=' inline-flex'>
                        <span>1.</span>
                        <Image width={42} height={42} alt='chrome' src={chromeSvg} ></Image>
                        <span>Install Chrome Extension</span>

                    </div>}
                />
                <FadeText
                    className=" bg-[bisque] rounded-lg px-2   py-1 text-5xl font-bold text-black dark:text-white"
                    direction="right"
                    framerProps={{
                        show: { transition: { delay: 0.4 } },
                    }}
                    text="2. Setting Your OpenAI KEY"
                />

                <div
                    onClick={() => {
                        router.push('/demo')
                    }}
                >
                    <FadeText
                        className=" bg-[aquamarine] hover:shadow-xl hover:opacity-80  border  cursor-pointer rounded-lg px-2 py-1 text-5xl font-bold text-black dark:text-white"
                        direction="right"
                        framerProps={{
                            show: { transition: { delay: 0.4 } },
                        }}
                        text="3. Click And Start"
                    />
                </div>

            </div>
        </div>

    </a>)
}