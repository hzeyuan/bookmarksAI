"use client"
import { FadeText } from '@src/components/ui/fade-text';
import chromeSvg from '@assets/chrome.svg';
import Image from 'next/image';
import { DownloadIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
const Page = () => {
    const router = useRouter()
    return (<a
        id="how-to-use"
    >
        <div className="w-full bg-[aliceblue]  pb-10 lg:pb-32">
            <div className="relative z-20 pt-10 lg:pt-32  max-w-7xl mx-auto">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                    Guide
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
                        <span>Download And Install Chrome Extension</span>

                    </div>}
                />
                <div>
                    <button
                        className="group relative my-8 rounded-full bg-gradient-to-r from-blue-300/30 via-blue-500/30 via-40% to-purple-500/30 p-1 text-white transition-transform hover:scale-110 active:scale-105"
                    >
                        <div
                            className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-300 via-blue-500 via-40% to-purple-500 px-4 py-2 text-white"
                            onClick={() => {
                                const link = document.createElement('a');
                                link.href = 'https://static.usesless.com/bookmarks.ai/extension.zip'; // 假设public目录是你的根目录
                                link.download = 'extension.zip';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                            }}
                        >
                            <Image src={chromeSvg} alt="Chrome Extension" className="w-6 h-6" />
                            <span className="font-semibold">Download Extension</span>

                            <DownloadIcon
                                height={20}
                                width={20}
                                className="opacity-75 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:scale-110 group-hover:text-yellow-300 group-hover:opacity-100"
                            />
                        </div>
                    </button>
                </div>

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
                    }}>
                    <FadeText
                        className=" bg-[aquamarine] hover:shadow-xl hover:opacity-80  border  cursor-pointer rounded-lg px-2 py-1 text-5xl font-bold text-black dark:text-white"
                        direction="right"
                        framerProps={{
                            show: { transition: { delay: 0.4 } },
                        }}
                        text="3. Click And Start!"
                    />
                </div>
            </div>
        </div>

    </a>)
}

export default Page