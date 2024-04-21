'use client';
import { useEffect, useState } from "react"
import PlanService from "@/app/services/planService";
import { useContextProvider } from "@/app/utils/globalContext";
import Link from 'next/link';
// import { useRouter } from 'next/router';

export default function PlanAndPricing({ onPlanSelect, currentPage }) {

    const [planList, setPlanList] = useState([]); // Set initial value of planList to plans
    const [showPlans, setShowPlans] = useState([]);
    const { refreshCount } = useContextProvider();
    const [toSubscribe, setToSubscribe] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPlans = async () => {
            setLoading(true);
            try {
                const fetchedPlans = await PlanService.getActivePlans();
                setPlanList(fetchedPlans); // Assuming the API returns an array of plans
                const plansWithParsedFeatures = fetchedPlans.map(plan => ({
                    ...plan,
                    features: JSON.parse(plan.features || '[]') // Safely parse; default to an empty array if parsing fails
                }));
                setPlanList(plansWithParsedFeatures);
                const initialShowPlans = plansWithParsedFeatures.map(() => ({
                    show: false,
                    showTwo: false
                }));
                setShowPlans(initialShowPlans);
                
            } catch (error) {
                console.error("Error fetching plans:", error);
                // Handle the error appropriately
            }
            setLoading(false);
        };

        fetchPlans();
    }, [refreshCount]);

    const handleShowMore = (index) => () => {
        // Update show state immediately
        if(showPlans[index].show === false) {
            setShowPlans(currentPlans => {
                return currentPlans.map((plan, i) => {
                    if (i === index) {
                        return { ...plan, show: true };
                    }
                    return plan;
                });
            });
            setTimeout(() => {
                setShowPlans(currentPlans => {
                    return currentPlans.map((plan, i) => {
                        if (i === index && plan.show) {
                            // Toggle showTwo only if show is true
                            return { ...plan, showTwo: true };
                        }
                        return plan;
                    });
                });
            }
            , 300);
        } else {
            setShowPlans(currentPlans => {
                return currentPlans.map((plan, i) => {
                    if (i === index) {
                        return { ...plan, show: false, showTwo: false};
                    }
                    return plan;
                });
            });
        }
    };
    
    

    const handleSubscribe = (plan) => {
        console.log('Subscribing to plan:', plan);
        // setToSubscribe(plan);
        // console.log('Subscribing to plan:', toSubscribe);
        // console.log(toSubscribe.title);
        onPlanSelect(plan);
    };


    //loading component
    const loadingComponent = [1,2,3]

    return (
        <div className="bg-main-day px-10 pb-16">
            <h1 className="text-center text-4xl text-main-day p-10">Plans and Pricing</h1>
            <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start w-full xl:px-28 pt-6">
                {!loading && planList.length !== 0 && planList.map((plan, index) => (
                    <div key={index} className="flex flex-col items-center justify-center w-full mb-10 md:w-1/2 smooth-component ">
                        <div className="flex-col items-center justify-center bg-two-day p-10 pb-10 border-2 border-slate-800 min-height-plan min-w-80 max-w-96">
                            <h2 className="text-2xl text-main-day text-center min-h-20 flex items-center justify-center">{plan.title}</h2>
                            <hr className="border-t-2 w-full border-slate-800 mb-6"></hr>
                            <p className="text-5xl text-three-day text-center bg-three-day mb-6">{plan.price}</p>
                            <p className="text-main-day text-2xl font-base mb-10 min-h-52">{plan.description}</p>
                            <p className="text-main-day text-2xl text-center font-light mb-16">Valid for - {plan.validPeriod}</p>
                            <div className="flex justify-center hover:cursor-pointer">
                                {showPlans.length!== 0 && showPlans[index].show === false ? 
                                (currentPage === "Home" ? (  // Check if the current page is "main"
                                    <Link className="text-three-day hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800 hover:font-bold bg-item-day smooth-component-300 text-xl p-2 text-center w-48" href="../pages/planPage">
                                        Show More
                                    </Link>
                                ) : (
                                    <div onClick={handleShowMore(index)} className="text-three-day hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800 hover:font-bold smooth-component-300 bg-item-day text-xl p-2 text-center w-48">
                                        Show More
                                    </div>
                                ))
                                : 
                                <div onClick={handleShowMore(index)} className="text-three-day hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800 hover:font-bold smooth-component-300 bg-item-day text-xl p-2 text-center w-48">Show Less</div>
                                }
                            </div>
                        </div>
                        <div className={`h-1 smooth-component-300 relative w-full max-w-96 ${showPlans.length !== 0 && showPlans[index].show === true ? ' py-52' : ''}`}>                                       {/* Added 'flex-col, and items-center to get the subscribe button centered UwU */}
                            <div className={`bg-two-day p-10 pt-0 smooth-component-300 absolute top-0 left-0 border-2 border-t-0 border-slate-800  ${showPlans.length !== 0 && showPlans[index].show === true ? 'flex flex-col items-center' : 'hidden'} ${showPlans.length !== 0 && showPlans[index].showTwo === true ? 'opacity-100' : 'opacity-0'}`}>
                                <ul className="text-two-day text-xl list-disc pl-4 pt-4">
                                    {plan.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                                <div className="mt-4">
                                    <div onClick={() => handleSubscribe(plan)} className="text-three-day hover:bg-gray-100 hover:text-gray-800 hover:border-gray-800 hover:font-bold smooth-component-300 bg-item-day text-xl p-2 text-center w-48">
                                        Subscribe
                                    </div>
                                    {/* <Link
                                       className="text-three-day bg-item-day text-xl p-2 text-center w-48"
                                       href={{
                                            pathname: '/pages/planConfPage',
                                            query: { data: plan.title }
                                       }}
                                    >           
                                            Subscribe
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                ))}
                {loading && loadingComponent.map((item, index) => (
                    <div key={index} className="flex flex-col items-center justify-center w-full mb-10 md:w-1/2 smooth-component">
                        <div className="animate-pulse flex-col items-center justify-center bg-slate-200 p-10 pb-10 border-2 border-slate-300 min-height-plan min-w-90 max-w-96 shadow">
                            <div className="w-56 h-5 bg-slate-300 rounded-full shadow mb-10 pulse-gradient"></div>
                            <div className="flex justify-center">
                                <div className="w-48 h-10 bg-slate-300 rounded shadow pulse-gradient"></div>
                            </div>
                            <div className="flex justify-center my-10">
                                <div className="w-48 h-20 bg-slate-300 rounded shadow pulse-gradient"></div>
                            </div>
                            <div className="w-56 h-5 bg-slate-300 rounded-full shadow mb-4 pulse-gradient"></div>
                            <div className="w-56 h-5 bg-slate-300 rounded-full shadow mb-4 pulse-gradient"></div>
                            <div className="w-56 h-5 bg-slate-300 rounded-full shadow mb-4 pulse-gradient"></div>
                            <div className="w-56 h-5 bg-slate-300 rounded-full shadow mb-4 pulse-gradient"></div>
                            <div className="w-56 h-5 bg-slate-300 rounded-full shadow mb-16 pulse-gradient"></div>
                            <div className="flex justify-center">
                                <div className="w-48 h-10 bg-slate-300 rounded shadow pulse-gradient"></div>
                            </div>
                        </div>
                    </div>                
                    ))}
            </div>
        </div>
    )
}