import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaTrashAlt,
  FaSignOutAlt,
  FaSave,
} from "react-icons/fa";
import { useAuthStore } from "../Store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProfileModal = ({
  show,
  onHide,
}: {
  show: boolean;
  onHide: () => void;
}) => {
  const { user, logout, updateProfile, deleteAccount } = useAuthStore();
  const [username, setUsername] = useState(user?.username || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    if (newPassword && newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword && !currentPassword) {
      toast.error("Please enter your current password to set a new one");
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile({
        username: username.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });

      setCurrentPassword("");
      setNewPassword("");
      onHide(); // Close modal after update
    } catch (error) {
      // Error toast is already shown inside Zustand store
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to delete your account");
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAccount(deletePassword); // Zustand handles toast + auth state reset
      setShowDeleteModal(false);
      onHide(); // Optional: close settings modal
      navigate("/"); // ✅ Redirect after successful deletion
    } catch (error) {
      // ❌ No need for additional toast — handled in Zustand
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onHide();
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true);
    onHide();
  };

  return (
    <>
      {/* Main Profile Modal */}
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="dark-profile-modal"
      >
        <Modal.Header closeButton className="modal-header-dark">
          <Modal.Title className="modal-title">
            <FaUser className="me-2" />
            Account Settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-dark">
          <Form>
            <Form.Group className="mb-4 form-group">
              <Form.Label className="form-label">Username</Form.Label>
              <div className="input-with-icon">
                <FaUser className="input-icon" />
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control-dark"
                  placeholder="Enter your username"
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4 form-group">
              <Form.Label className="form-label">Current Password</Form.Label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <Form.Control
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-control-dark"
                  placeholder="Enter current password"
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Text className="hint-text">
                Required if changing password
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4 form-group">
              <Form.Label className="form-label ">New Password</Form.Label>
              <div className="input-with-icon">
                <FaLock className="input-icon" />
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control-dark"
                  placeholder="Enter new password"
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </div>
              <Form.Text className=" hint-text">
                Leave blank to keep current password
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>

        {/* Vertical Action Buttons */}
        <Modal.Footer className="modal-footer-vertical">
          <Button
            variant="primary"
            className="action-button save-button"
            onClick={handleSave}
            disabled={isUpdating}
          >
            <FaSave className="me-2" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            variant="outline-secondary"
            className="action-button logout-button"
            onClick={handleLogout}
            disabled={isUpdating}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </Button>

          <Button
            variant="outline-danger"
            className="action-button delete-button"
            onClick={handleOpenDeleteModal}
            disabled={isUpdating}
          >
            <FaTrashAlt className="me-2" />
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        className="dark-modal"
      >
        <Modal.Header closeButton className="modal-header-dark">
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-dark">
          <p className="text-light mb-4">
            This will permanently delete your account and all data. This action
            cannot be undone.
          </p>
          <Form.Group>
            <Form.Label className="text-light">
              Enter your password to confirm:
            </Form.Label>
            <Form.Control
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="form-control-dark mb-3"
              placeholder="Your password"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="modal-footer-vertical">
          <Button
            variant="secondary"
            className="action-button"
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            className="action-button"
            onClick={handleDeleteAccount}
            disabled={isDeleting || !deletePassword}
          >
            {isDeleting ? "Deleting..." : "Permanently Delete Account"}
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
/* Dark Theme Styles with Advanced Animations */
.dark-profile-modal .modal-content,
.dark-modal .modal-content {
  background-color: #1e1e1e;
  color: #ffffff;
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  transform: translateY(20px);
  opacity: 0;
  animation: modalEntrance 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;;
}

@keyframes modalEntrance {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
  

.modal-header-dark {
  background: linear-gradient(135deg, #180e0fff 0%, #000000ff 100%);
  border-bottom: 1px solid #333;
  color: #ffffff;
  border-radius: 12px 12px 0 0 !important;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.modal-header-dark::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.modal-body-dark {
  background: linear-gradient(135deg, #000000ff 0%, #00000071 100%);
  color: #ffffff;
  padding: 2rem;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Vertical Footer Styling with Hover Effects */
.modal-footer-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, #0c000027 0%, #000000ff 100%);
  border-top: 1px solid #333;
  border-radius: 0 0 12px 12px;
  padding: 2rem;
  position: relative;
}

.modal-footer-vertical::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.action-button {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.2);
}

.action-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(100%);
  transition: transform 0.3s ease-out;
}

.action-button:hover::after {
  transform: translateY(0);
}

.save-button {
  background: linear-gradient(135deg, #5d6583ff 0%, #3a5bcf 100%);
  border: none;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(74, 107, 223, 0.3);
}

.logout-button {
  background: transparent;
  border: 1px solid rgba(108, 117, 125, 0.5);
  color: #ffffff;
  transition: all 0.3s;
}

.logout-button:hover {
  background: rgba(108, 117, 125, 0.2);
  border-color: rgba(108, 117, 125, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.delete-button {
  background: transparent;
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: #ffffff;
}

.delete-button:hover {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(220, 53, 69, 0.2);
}

/* Enhanced Form Elements with Floating Labels */
.form-group {
  position: relative;
  margin-bottom: 2rem;
}

.form-label {
  position: absolute;
  top: -10px;
  left: 15px;
  background-color: #1e1e1e;
  padding: 0 8px;
  font-size: 0.8rem;
  color: #ffffff;
  transform-origin: left center;
  transition: all 0.3s ease;
  z-index: 1;
}

.form-control-dark {
  background-color: #1d1d1dff;
  color: #ffffff;
  border: 1px solid #444;
  padding: 16px 20px 16px 45px;
  height: 52px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
}

.form-control-dark:focus {
  background-color: #000000ff;
  color: #ffffff;
  border-color: #4a6bdf;
  box-shadow: 0 0 0 7px rgba(0, 55, 255, );
  outline: none;
}

.form-control-dark::placeholder {
  color: #ffffff;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #ffffffff;
  z-index: 2;
  transition: color 0.3s;
}

.form-control-dark:focus + .input-icon {
  color: #4a6bdf;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #0088ffff;
  background: none;
  border: none;
  z-index: 2;
  transition: all 0.3s;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.password-toggle:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.hint-text {
  font-size: 0.8rem;
  display: block;
  margin-top: 8px;
  color: #6c757d;
  animation: fadeIn 0.5s ease-out;
}

/* Enhanced Close Button */
.btn-close {
  filter: invert(1);
  opacity: 0.7;
  transition: all 0.3s ease;
  width: 24px;
  height: 24px;
  background-size: 60%;
  position: relative;
}

.btn-close:hover {
  opacity: 1;
  transform: rotate(90deg);
}

/* Ripple Effect for Buttons */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.ripple {
  position: relative;
  overflow: hidden;
}

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

/* Loading Animation */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

/* Responsive Adjustments */
@media (max-width: 576px) {
  .modal-body-dark, .modal-footer-vertical {
    padding: 1.5rem;
  }
  
  .form-control-dark {
    padding: 14px 16px 14px 40px;
    height: 48px;
  }
}
          
        `}
      </style>
    </>
  );
};

export default ProfileModal;
