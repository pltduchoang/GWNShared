export default function Spinner () {
    return(
        <div>
            <div className=" animate-spin">
                <svg height="40px" width="40px" transform="scale(1, -1)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><radialGradient id="a3" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)"><stop offset="0" stopColor="#7EFF2C"></stop><stop offset=".3" stopColor="#7EFF2C" stopOpacity=".9"></stop><stop offset=".6" stopColor="#7EFF2C" stopOpacity=".6"></stop><stop offset=".8" stopColor="#7EFF2C" stopOpacity=".3"></stop><stop offset="1" stopColor="#7EFF2C" stopOpacity="0"></stop></radialGradient><circle transformOrigin="center" fill="none" stroke="url(#a3)" strokeWidth="17" strokeLinecap="round" strokeDasharray="200 1000" strokeDashoffset="0" cx="100" cy="100" r="70"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="1.5" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></circle><circle transformOrigin="center" fill="none" opacity=".2" stroke="#7EFF2C" strokeWidth="17" strokeLinecap="round" cx="100" cy="100" r="70"></circle></svg>            
            </div>
        </div>
    )
}