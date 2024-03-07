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
    console.log('login data:', userData);

    try {
      const response = await fetch('api/auth/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`fetch Error ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Login success:', data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('token stored:');
        onLogin(data);
      } else {
        console.error('no token found with response');
      }
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoginSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());
    try {
      const response = await fetch('api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.statusText}`);
      }

      const { token, user } = await response.json();
      if (token) {
        localStorage.setItem('token', token);
        console.log('token stored');
        onLogin(user);
        handleCloseLoginModal();
      } else {
        console.error('no token found in response');
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || 'An unknown error occurred';
      console.error('Error logging in:', errorMessage);
      alert(`Error logging in: ${errorMessage}`);
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
