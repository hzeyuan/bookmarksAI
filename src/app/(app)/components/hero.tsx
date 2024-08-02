"use client"
import bannerSvg from '@assets/banner.svg';
import ChromeExtensionButton from './chrome-extension-button';
import Image from 'next/image';
import { sendToBackgroundViaRelay } from "@plasmohq/messaging"
import { useRouter } from 'next/navigation';
import sponsorSvg from '@assets/302.jpg';
import { Zap } from 'lucide-react';
const Hero = () => {

    const router = useRouter();
    return (
        <>
            <div className="z-0 absolute w-80 h-60 bg-blue-400 blur-[80px] opacity-30 top-40 left-40" />
            <div className="z-0 absolute w-80 h-60 bg-purple-400 blur-[80px] opacity-30 top-40 right-40" />
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#d797e7] to-[#75a6f5] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
                    }}
                ></div>
            </div>

            <div
                className='absolute inset-x-0 top-[calc(100%-40rem)] sm:top-[calc(100%-65rem)] -z-10 transform-gpu overflow-hidden blur-3xl'
                aria-hidden='true'
            >
                <div
                    className='relative aspect-[1020/880] sm:-left-3/4 sm:translate-x-1/4 dark:hidden bg-gradient-to-br from-amber-400 to-purple-300  opacity-50 w-[72.1875rem]'
                    style={{
                        clipPath: 'ellipse(80% 30% at 80% 50%)',
                    }}
                />
            </div>
            <div className=" pt-10 md:pt-20 relative z-50">

                <div className="mx-auto mb-12 flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-8 md:flex-row"
                >
                    <div
                        className="px-3 flex-1  animate__animated animate__fadeIn"
                        data-animation="animate__fadeIn"
                        style={{ opacity: 1 }}
                    >
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Help Organize  {" "}
                            <span className="relative whitespace-nowrap text-green-600">
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 418 42"
                                    className="absolute left-0 top-2/3 h-[0.58em] w-full fill-green-300/70"
                                    preserveAspectRatio="none"
                                >
                                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                                </svg>
                                <span className="relative">Bookmarks</span>
                            </span>{" "}
                            {/* Generator */}
                            <br />Simple and Efficient
                        </h1>
                        <div className="mt-6 text-gray-700 text-2xl font-medium leading-10 mb-5 max-w-3xl">
                            <Zap className="inline-block mr-2 text-blue-500" size={28} />
                            Unleash the power of <span className="text-blue-500 font-semibold">AI</span> to organize/record your digital life!
                            <p className="mt-3 text-xl">
                                Your <span className="text-green-500 font-semibold">personal assistant</span> for managing cluttered browser tabs and history.
                                Quickly find <span className="text-purple-500 font-semibold">anything you need</span>, just like having a thoughtful secretary at your fingertips.
                            </p>
                        </div>

                        <div className="mt-10 flex  gap-x-6">
                            <button
                                onClick={() => {
                                    router.replace('/demo')
                                }}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                            >
                                <span>Get started</span>
                                <div className="relative right-0 group-hover:translate-x-1 w-5 duration-200">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={16}
                                        height={16}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="arrow-right"
                                    >
                                        <path
                                            className="opacity-0 group-hover:opacity-100 duration-200"
                                            d="M5 12h14"
                                        />
                                        <path d="m12 5 7 7-7 7" />
                                    </svg>
                                </div>
                            </button>
                            <a
                                href='#demo'
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                                Demo
                            </a>
                        </div>

                        <div className="">
                            <ChromeExtensionButton
                                onClick={() => {
                                    router.push('/extension')
                                }}
                            ></ChromeExtensionButton>
                        </div>

                        <a className=' flex' href="https://302.ai/">
                            <Image className=' py-2 w-[400px]' width={1080} height={300} src={sponsorSvg.src} />
                        </a>

                        <p>The project is still in the early stage, and the code is open-sourced on
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href="https://github.com/hzeyuan/bookmarksAI"
                            >
                                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9  w-9 px-0">
                                    <svg viewBox="0 0 438.549 438.549" className="h-4 w-4">
                                        <path
                                            fill="currentColor"
                                            d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                                        />
                                    </svg>
                                    <span className="sr-only">GitHub</span>
                                </div>
                            </a>
                        </p>
                    </div>

                    <div className="flex-1">
                        <Image
                            alt="banner"
                            className="  object-fill w-full h-full"
                            width={500}
                            height={500}
                            src={bannerSvg.src}
                        />
                    </div>
                </div>
                {/* <div className=' w-full  relative p-4 mb-12  max-w-screen-2xl mx-auto'>
                    <DotPattern />
                    <VelocityScroll
                        text="open source · bookmark organization · browser history management"
                        default_velocity={5}
                        className="font-display text-center text-3xl  tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:leading-[2rem]"
                    />
                </div> */}

            </div>
        </>
    )
}

export default Hero