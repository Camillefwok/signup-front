import React from 'react';
import PropTypes from 'prop-types';

import { TARGET_API_LABELS } from '../lib/api';

import { withUser } from './UserContext';

const Header = ({ user, logout }) => {
  // Form page already has contact button, no need to display this one.
  const displayContactLink = !Object.keys(TARGET_API_LABELS).some(target_api =>
    window.location.pathname.startsWith(`/${target_api.replace(/_/g, '-')}`)
  );

  return (
    <header className="navbar">
      <div className="navbar__container">
        <a
          className="navbar__home"
          href="https://api.gouv.fr/rechercher-api?filter=signup"
        >
          <img
            className="navbar__logo"
            src="/images/logo_api.svg"
            alt="Accueil de signup.api.gouv.fr"
          />
        </a>

        <nav>
          <ul className="nav__links">
            <li className="nav__item">
              <a href="https://api.gouv.fr/apropos">À propos</a>
            </li>
            {displayContactLink && (
              <li className="nav__item">
                <a href="mailto:contact@api.gouv.fr?subject=Contact%20via%20signup.api.gouv.fr">
                  Nous contacter
                </a>
              </li>
            )}
            {user && (
              <li className="nav__item">
                <div className="dropdown">
                  {user.email}
                  <div className="dropdown-content" style={{ top: '2.8em' }}>
                    <a onClick={logout} href="#logout">
                      Se déconnecter
                    </a>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  user: null,
};

export default withUser(Header);
