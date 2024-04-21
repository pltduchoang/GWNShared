import React, { useEffect, useState } from 'react';
import CoachImageService from '@/app/services/coachImageService'; // Import the CoachImageService from the services director

export default function MeetCoach() {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCoaches = async () => {
            setLoading(true);
            try {
                const fetchedCoaches = await CoachImageService.getAllCoachImages();
                setCoaches(fetchedCoaches);
            } catch (error) {
                console.error('Failed to fetch coach images:', error);
            }
            setLoading(false);
        };

        fetchCoaches();
    }, []);

    const svg = (
        <svg width="160px" height="160px" viewBox="0 0 24 24" fill="none" >
        <g clip-path="url(#clip0_15_82)">
        <rect width="24" height="24" fill="none"/>
        <g filter="url(#filter0_d_15_82)">
        <path d="M14.3365 12.3466L14.0765 11.9195C13.9082 12.022 13.8158 12.2137 13.8405 12.4092C13.8651 12.6046 14.0022 12.7674 14.1907 12.8249L14.3365 12.3466ZM9.6634 12.3466L9.80923 12.8249C9.99769 12.7674 10.1348 12.6046 10.1595 12.4092C10.1841 12.2137 10.0917 12.022 9.92339 11.9195L9.6634 12.3466ZM4.06161 19.002L3.56544 18.9402L4.06161 19.002ZM19.9383 19.002L20.4345 18.9402L19.9383 19.002ZM16 8.5C16 9.94799 15.2309 11.2168 14.0765 11.9195L14.5965 12.7737C16.0365 11.8971 17 10.3113 17 8.5H16ZM12 4.5C14.2091 4.5 16 6.29086 16 8.5H17C17 5.73858 14.7614 3.5 12 3.5V4.5ZM7.99996 8.5C7.99996 6.29086 9.79082 4.5 12 4.5V3.5C9.23854 3.5 6.99996 5.73858 6.99996 8.5H7.99996ZM9.92339 11.9195C8.76904 11.2168 7.99996 9.948 7.99996 8.5H6.99996C6.99996 10.3113 7.96342 11.8971 9.40342 12.7737L9.92339 11.9195ZM9.51758 11.8683C6.36083 12.8309 3.98356 15.5804 3.56544 18.9402L4.55778 19.0637C4.92638 16.1018 7.02381 13.6742 9.80923 12.8249L9.51758 11.8683ZM3.56544 18.9402C3.45493 19.8282 4.19055 20.5 4.99996 20.5V19.5C4.70481 19.5 4.53188 19.2719 4.55778 19.0637L3.56544 18.9402ZM4.99996 20.5H19V19.5H4.99996V20.5ZM19 20.5C19.8094 20.5 20.545 19.8282 20.4345 18.9402L19.4421 19.0637C19.468 19.2719 19.2951 19.5 19 19.5V20.5ZM20.4345 18.9402C20.0164 15.5804 17.6391 12.8309 14.4823 11.8683L14.1907 12.8249C16.9761 13.6742 19.0735 16.1018 19.4421 19.0637L20.4345 18.9402Z" fill="#CBD5E1"/>
        </g>
        </g>
        
        </svg>
    );

    return (
        <div className="w-full bg-two-day">
            <div className="">
                <h1 className="text-center text-4xl text-main-day py-10">Meet Our Coaches</h1>
                <div className="lg:flex lg:flex-row">
                    {loading ? (
                        <div className="w-full flex flex-col items-center text-main-day py-6 lg:w-6/12 lg:items-end">
                            <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
                                <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                                    <div className="pulse-gradient w-40 h-40 md:w-52 md:h-52 lg:w-58 lg:h-58 bg-slate-200 rounded-full shadow flex justify-center items-center">
                                        {svg}
                                    </div>
                                    <div className="pulse-gradient w-24 h-4 bg-slate-200 rounded shadow"></div>
                                </div>
                            </div>
                            <div className="flex space-x-6 mt-6">
                                <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                                    <div className="pulse-gradient w-40 w- h-40 md:w-52 md:h-52 lg:w-58 lg:h-58 bg-slate-200 rounded-full shadow flex justify-center items-center">
                                        {svg}
                                    </div>
                                    <div className="pulse-gradient w-24 h-4 bg-slate-200 rounded shadow"></div>
                                </div>
                                <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                                    <div className="pulse-gradient w-40 h-40 md:w-52 md:h-52 lg:w-58 lg:h-58 bg-slate-200 rounded-full shadow flex justify-center items-center">
                                        {svg}
                                    </div>
                                    <div className="pulse-gradient w-24 h-4 bg-slate-200 rounded shadow"></div>
                                </div>
                            </div>
                        </div>
                        ):(
                            <div className="w-full flex flex-col items-center text-main-day py-6 lg:w-6/12 lg:items-end">
                                <div className="w-full flex flex-col items-center lg:items-end justify-center space-y-4">
                                    {coaches.slice(0, 1).map((coach, index) => (
                                        <div key={index} className="flex flex-col justify-center items-center space-y-4 w-1/2">
                                            <img src={coach.imageURL} className="w-40 h-40 md:w-52 md:h-52 lg:w-58 lg:h-58 object-cover rounded-full shadow" alt={coach.imageALT} />
                                            <p>{coach.imageALT}</p>
                                        </div> 
                                    ))}
                                </div>
                                <div className="flex space-x-6">
                                    {coaches.slice(1).map((coach, index) => (
                                        <div key={index} className="flex flex-col justify-center items-center space-y-4 w-full">
                                            <img src={coach.imageURL} className="w-40 h-40 md:w-52 md:h-52 lg:w-58 lg:h-58 object-cover rounded-full shadow" alt={coach.imageALT} />
                                            <p>{coach.imageALT}</p>
                                        </div> 
                                    ))}
                                </div>
                            </div>
                        )}
                    <div className="flex justify-center text-main-day text-left text-xl md:text-2xl xl:text-3xl font-semibold px-16 pb-16 lg:flex lg:w-6/12 lg:items-center lg:justify-start">
                        <p className=" w-full md:w-2/3 lg:w-2/3 xl:w-7/12 font-light">Are you ready to transform your life? Our dedicated team of lifestyle coaches is here to guide you on a journey of personal growth and fulfillment. With our unique blend of expertise, passion, and empathy, we offer personalized coaching that caters to your individual needs.</p>
                    </div>
                </div>
            </div>
        </div>
    );

}


