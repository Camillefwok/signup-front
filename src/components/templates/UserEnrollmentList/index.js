import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { groupBy } from 'lodash';

import './UserEnrollments.css';

import { openLink } from '../../../lib';
import { getUserEnrollments } from '../../../services/enrollments';

import AddIcon from '../../atoms/icons/add';
import Loader from '../../atoms/Loader';

import Enrollment from './Enrollment';

const { REACT_APP_API_GOUV_HOST: API_GOUV_HOST } = process.env;

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
    openLink(e, history, targetUrl);
  };

  return (
    <div className="user-enrollments-page">
      <div className="container header">
        <h2>Mes demandes</h2>
        <a href={`${API_GOUV_HOST}/datapass/api`}>
          <button className="button large">
            Nouvelle demande API
            <div className="button-icon">
              <AddIcon color="white" />
            </div>
          </button>
        </a>
        <a href="https://aidantsconnect.beta.gouv.fr/habilitation">
          <button className="button large">
            Nouvelle demande Aidants Connect
            <div className="button-icon">
              <AddIcon color="white" />
            </div>
          </button>
        </a>
      </div>

      <section className="section-grey enrollments-section">
        {isLoading ? (
          <div className="layout-full-page">
            <Loader />
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
              <div className="notification">
                <p>
                  Vous n’avez aucune demande en cours.{' '}
                  <a href={`${API_GOUV_HOST}/datapass/api`}>
                    Faire ma première demande
                  </a>
                </p>
              </div>
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
