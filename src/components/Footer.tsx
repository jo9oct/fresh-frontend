
import React, { useState } from "react";
import { useThemeStore } from "../Store/TeamToggle";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {

    const { isDark } = useThemeStore(); // Access the theme state (dark/light mode)
    const navigate = useNavigate(); // React Router hook for programmatic navigation
    
    // State to control visibility of Privacy Policy modal
    const [showPrivacy, setShowPrivacy] = useState<Boolean>(false);
    
    // State to control visibility of Terms & Conditions modal
    const [ShowTerms, setShowTerms] = useState<Boolean>(false);
    
    // Handler to close modals when clicking on the backdrop
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only close if the click was on the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
            setShowPrivacy(false); // Close Privacy Policy modal
            setShowTerms(false);   // Close Terms & Conditions modal
        }
    };
    

    return (
        <>
            <footer className={`${isDark ? "HeaderToggle" : ""}`}>
                <footer className={`borderChange text-white `} style={{ backgroundColor: "#170F2F" }}>
                    <div className="container py-5">
                        <div className="row gy-5">

                            <div className="col-12 col-md-5 d-flex flex-column gap-3">
                                <div className="d-flex align-items-center gap-3">
                                <img src="/pro.png" alt="Logo" width={55} height={55} />
                                <h4 className="mb-0">Freshman <span style={{ color: "#179227" }}>EXAM</span></h4>
                                </div>
                                <p>
                                Empowering Ethiopian university freshman students with comprehensive exam preparation
                                resources and practice quizzes.
                                </p>
                                <img src="/images__1_-removebg-preview.png" alt="Ethiopia" width={84} height={65} />
                            </div>

                            <div className="col-12 col-md-7 d-flex flex-wrap justify-content-around gap-4">
                                <div className="footerLink">
                                <p className="fw-bold">Quick Links</p>
                                <p onClick={() => navigate("/courses")} style={{cursor:"pointer"}}>All Courses</p>
                                <p onClick={() => navigate("/blog")} style={{cursor:"pointer"}}>Study Tips</p>
                                <p onClick={() => navigate("/about")} style={{cursor:"pointer"}}>About Us</p>
                                <p onClick={() => navigate("/contact")} style={{cursor:"pointer"}}>Contact</p>
                                </div>
                                <div className="footerLink">
                                <p className="fw-bold">Legal</p>
                                <p onClick={() => setShowPrivacy(true)} style={{cursor:"pointer"}}>Privacy Policy</p>
                                <p onClick={() => setShowTerms(true)} style={{cursor:"pointer"}}>Terms of Service</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </footer>
            </footer>

            <div className="my-3 pt-3  ">
            <p className="text-center mb-0">
                © 2024 FreshmanExam.com. All rights reserved. Made with ❤️ for Ethiopian students.
            </p>
            </div>

            {showPrivacy && 
                <>
                    <div className="modal show fade d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="privacyLabel" onClick={handleBackdropClick}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <div>
                            <h4 className="fw-bold mb-0" id="privacyLabel">Privacy Policy</h4>
                            </div>
                            <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setShowPrivacy(false)}
                            ></button>
                        </div>
                        <div className="modal-body pt-2" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            <p><strong>Effective Date:</strong> August 11, 2025</p>

                            <p>Welcome to <a href="http://localhost:5173/">FreshmanEXAM</a> our Website. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website.</p>

                            <h5>1. Information We Collect</h5>
                            <ul>
                            <li><strong>Personal Information:</strong> When you register or contact us, we may collect your name, email address, and other contact details.</li>
                            <li><strong>Usage Data:</strong> We collect information about how you interact with our website, such as IP address, browser type, pages visited, and usage patterns through cookies and similar technologies.</li>
                            </ul>

                            <h5>2. How We Use Your Information</h5>
                            <ul>
                            <li>To provide, maintain, and improve our services.</li>
                            <li>To communicate with you, respond to your inquiries, and send important updates.</li>
                            <li>To monitor and analyze usage and trends to enhance user experience.</li>
                            <li>To comply with legal obligations.</li>
                            </ul>

                            <h5>3. Cookies and Tracking Technologies</h5>
                            <p>We use cookies and similar tracking technologies to personalize content and analyze traffic. You can manage or disable cookies through your browser settings.</p>

                            <h5>4. Data Sharing and Disclosure</h5>
                            <p>We do not sell your personal information. We may share data with trusted third parties who help us operate the website, subject to confidentiality agreements. We may disclose information if required by law.</p>

                            <h5>5. Data Security</h5>
                            <p>We implement reasonable security measures to protect your information from unauthorized access, alteration, or destruction.</p>

                            <h5>6. Your Rights</h5>
                            <p>You may access, update, or request deletion of your personal information by contacting us. Please note that some data may be retained for legal or legitimate business purposes.</p>

                            <h5>7. Children's Privacy</h5>
                            <p>Our website is not directed to children under 13. We do not knowingly collect personal data from children.</p>

                            <h5>8. Changes to This Policy</h5>
                            <p>We may update this Privacy Policy from time to time. Changes will be posted here with an updated effective date.</p>

                            <h5>9. Contact Us</h5>
                            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
                            <p><em><a href="#">[freshmanexam@gmail.com]</a></em></p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>


                </>
            }

            {ShowTerms && 
 
                <>
                    <div className="modal show fade d-block" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="termsLabel" onClick={handleBackdropClick}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content rounded-4 shadow">
                        <div className="modal-header border-0 pb-0">
                            <div>
                            <h4 className="fw-bold mb-0" id="termsLabel">Terms of Service</h4>
                            </div>
                            <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setShowTerms(false)}
                            ></button>
                        </div>
                        <div className="modal-body pt-2" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                            <p><strong>Effective Date:</strong> August 11, 2025</p>

                            <p>Welcome to <a href="http://localhost:5173/">FreshmanEXAM</a>. By accessing or using our website, you agree to comply with and be bound by these Terms of Service ("Terms"). Please read them carefully.</p>

                            <h5>1. Use of the Website</h5>
                            <p>You agree to use the website only for lawful purposes and in a way that does not infringe the rights of others or restrict their use.</p>
                            <p>You must not misuse our services or interfere with the website s operation.</p>

                            <h5>2. Intellectual Property</h5>
                            <p>All content, trademarks, logos, and materials on this website are owned by or licensed to us. You may not copy, reproduce, or distribute any content without our prior written permission.</p>

                            <h5>3. User Accounts</h5>
                            <p>If you create an account, you are responsible for maintaining the confidentiality of your login information and all activities under your account.</p>

                            <h5>4. Disclaimers and Limitation of Liability</h5>
                            <p>The website is provided "as is" without warranties of any kind, either express or implied.</p>
                            <p>We do not guarantee the accuracy, completeness, or availability of the website.</p>
                            <p>We are not liable for any damages arising from your use of the website.</p>

                            <h5>5. Changes to the Terms</h5>
                            <p>We reserve the right to modify these Terms at any time. Continued use of the website after changes means you accept the updated Terms.</p>

                            <h5>6. Governing Law</h5>
                            <p>These Terms are governed by the laws of the jurisdiction in which we operate.</p>

                            <h5>7. Contact Us</h5>
                            <p>If you have questions about these Terms, please contact us at:</p>
                            <p><em><a href="#">[freshmanexam@gmail.com]</a></em></p>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>

                </>
            }
             
        </>
    );
};


export default Footer;
