import { type FormEvent, useState } from 'react';

interface SignUpFormProps {
  onLogin: (user: { username: string }) => void;
}
export function SignUpForm({ onLogin }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseLoginModal = () => {
    console.log(
      'Before closing modal. Current showLoginModal state:',
      showLoginModal
    );
    setShowLoginModal(false);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    try {
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.statusText}`);
      }
      const user = await res.json();
      onLogin(user);
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('login submitted');
    try {
      setIsLoading(true);
      const formData = new FormData(e.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      console.log('login data', userData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('api/auth/sign-in', req);
      console.log('API response:', res.status, res.statusText);

      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { token, user } = await res.json();
      console.log(token);
      localStorage.setItem('token', token);
      console.log('token:', token);
      console.log('user:', user);
      // localStorage.setItem('user', JSON.stringify(user));
      //store in local storage here
      const username = user.username;
      console.log('you are in!:', username);
      console.log('Logged in', user);
      onLogin(user);
      handleCloseLoginModal();
    } catch (err) {
      alert(`Error logging: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container-fluid vh-100 custom-light-blue-bg p-1">
      <div className="chore-tracker-section border border-dark shadow mb-3 pb-2 bg-warning text-dark">
        <h1>ChoreTracker</h1>
      </div>
      <div className="sign-up-section">
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">
                Choose Username
                <input
                  required
                  name="username"
                  type="text"
                  className="form-control shadow"
                />
              </label>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">
                Choose Password
                <input
                  required
                  name="password"
                  type="password"
                  className="form-control shadow"
                />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-primary shadow border-0 bg-warning text-dark">
                Register
              </button>
            </div>
          </div>
        </form>
        <div className="mt-3">
          <p>
            Already signed up?{' '}
            <button onClick={handleLoginClick} className="btn btn-link">
              Login
            </button>
          </p>
        </div>
      </div>
      {showLoginModal ? (
        <div
          className="modal show"
          tabIndex={-1}
          role="dialog"
          style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content custom-light-blue-bg">
              <div className="modal-header">
                <h5 className="modal-title" id="loginModalLabel">
                  Login
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={handleCloseLoginModal}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleLoginSubmit}>
                  <div className="mb-3">
                    <label htmlFor="loginUsername" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      id="loginUsername"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="loginPassword" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="loginPassword"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary bg-warning border-0 text-dark">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showLoginModal ? <div className="modal-backdrop show"></div> : null}
    </div>
  );
}
