
import React from "react";
import { useThemeStore } from "../Store/TeamToggle";

const AdBanner: React.FC = () => {

    const { isDark } = useThemeStore();

    return (
        <>
            <div className={`${isDark ? "HeaderToggle" : "" }`}>
                <div className={`borderChange AdBanner d-flex justify-content-center align-items-center `}>AdBanner</div>
            </div>
        </>
    );
};


export default AdBanner;

