import Logo from "@/app/component/logo";
import { useContextProvider } from "@/app/utils/globalContext";

export default function Banner() {

    return (
        <div className="min-h-screen xl:h-fit xl:pb-20 bg-transparent flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center items-center lg:flex lg:flex-row px-4">
                <div className="w-9/12 md:w-1/2  xl:p-16 lg:flex lg:justify-end">
                    <img src="/images/gwn-logo.png" className="w-full h-full logo-large-screen object-cover" alt="Logo" />
                </div>
                <div className="banner-text w-10/12 text-three-day px-10 lg:px-4 flex justify-start items-center md:w-1/2 lg:w-1/2">
                    {/* <h1 className="text-4xl font-extrabold ">GROWTH WITHIN NUTRITION</h1> */}
                    <div className="lg:w-8/12 xl:w-7/12 lg:flex lg:flex-col">
                        <p className="text-4xl lg:text-5xl xl:text-5xl font-base ">Custom nutrition & lifestyle coaching plan</p>
                        <p className=" font-normal text-xl lg:text-2xl xl:text-2xl ">Your blueprint to wellness. Individualized Coaching, Habit Mastery, Weight Loss Support - A comprehensive approach for Lasting Change </p>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center mt-10 lg:mt-0">
                <a href="../infoPage">
                    <div className="text-2xl text-three-day px-6 py-2 bg-item-day smooth-component-300 learn-more-button">
                        Learn More
                    </div>
                </a>
            </div>
        </div>
    );
}