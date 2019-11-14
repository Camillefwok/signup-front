import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';

import AddIcon from '../../components/icons/add';
import Spinner from '../../components/icons/spinner';

import Enrollment from './Enrollment';

import './UserEnrollments.css';

import { getUserEnrollments } from '../../lib/services';

const UserEnrollmentList = ({ history }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsByOrganization, setEnrollmentsByOrganization] = useState();

  useEffect(() => {
    const onFetchData = async () => {
      setIsLoading(true);
      const enrollments = await getUserEnrollments();

      const enrollmentsByOrganization = groupBy(enrollments, e => e.siret);

      setEnrollmentsByOrganization(enrollmentsByOrganization);
      setIsLoading(false);
    };

    onFetchData();
  }, []);

  const handleSelectEnrollment = (e, id, target_api) => {
    const targetUrl = `/${target_api.replace(/_/g, '-')}/${id}`;

    if (e.ctrlKey || e.metaKey) {
      // metaKey is cmd on mac
      window.open(targetUrl); // open in new tab
    } else {
      history.push(targetUrl, { fromList: true });
    }
  };

  return (
    <div className="user-enrollments-page">
      <div className="container header">
        <h2>Mes demandes</h2>
        <a href="https://api.gouv.fr/?filter=signup">
          <button className="button large" name="nouvelle-demande">
            Nouvelle Demande
            <div className="button-icon">
              <AddIcon color="#fff" />
            </div>
          </button>
        </a>
      </div>

      <section className="section-grey enrollments-section">
        {isLoading ? (
          <div className="loader">
            <Spinner />
          </div>
        ) : (
          <div className="container">
            {Object.keys(enrollmentsByOrganization).length > 0 ? (
              <>
                {Object.keys(enrollmentsByOrganization).map(group => (
                  <div key={group}>
                    <div className="organisation">
                      {enrollmentsByOrganization[group][0].nom_raison_sociale}
                    </div>
                    <div className="enrollments-list">
                      {enrollmentsByOrganization[group].map(enrollment => (
                        <Enrollment
                          key={enrollment.id}
                          {...enrollment}
                          onSelect={handleSelectEnrollment}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ flex: '1' }}>Vous n’avez pas de demande</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

UserEnrollmentList.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default UserEnrollmentList;
