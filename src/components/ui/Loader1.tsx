import React from "react";
import { CircleLoader } from "react-spinners";
import { useThemeStore } from "../../Store/TeamToggle";

const Loader1: React.FC = () => {
    const { isDark } = useThemeStore(); // Get current theme (dark/light) from Zustand store

    return (
        <>
            {/* Loader container centered vertically and horizontally */}
            <div
                className={`Loader d-flex justify-content-center align-items-center`}
                style={{ height: "65vh" }} // Set height to occupy majority of viewport
            >
                {/* CircleLoader spinner with color based on theme */}
                <CircleLoader
                    color={isDark ? "#ffffff" : "#09270b"} // White for dark mode, dark green for light mode
                    cssOverride={{}} // Optional custom CSS overrides
                    loading // Show the loader
                    size={80} // Diameter of the spinner
                    speedMultiplier={1} // Spinner speed
                />
            </div>
        </>
    );
};

export default Loader1;
