import React from 'react';
import PropTypes from 'prop-types';

import Form from '../components/templates/Form';
import Nav from '../components/organisms/Nav';
import OrganisationSection from '../components/organisms/form-sections/OrganisationSection';
import DescriptionSection from '../components/organisms/form-sections/DescriptionSection';
import DonneesSection from '../components/organisms/form-sections/DonneesSection';
import CadreJuridiqueSection from '../components/organisms/form-sections/CadreJuridiqueSection';
import DonneesPersonnellesSection from '../components/organisms/form-sections/DonneesPersonnellesSection';
import MiseEnOeuvreSection from '../components/organisms/form-sections/MiseEnOeuvreSection';
import CguSection from '../components/organisms/form-sections/CguSection';

const DemarcheDescription = () => (
  <div className="notification grey">
    <p>
      L’accès au Registre de preuve de covoiturage est disponible pour les
      opérateurs de covoiturage et les autorités organisatrices de mobilité
      (AOM).
    </p>
    <p>
      Décrivez brièvement votre service ainsi que l’utilisation prévue des
      données transmises. C'est la raison pour laquelle vous traitez ces données
      qui peuvent inclure des données à caractère personnel.
    </p>
  </div>
);

const availableScopes = [
  {
    value: 'operator',
    label: 'Opérateur de covoiturage',
  },
  {
    value: 'territory',
    label: 'Autorités organisatrices de mobilité (AOM)',
  },
];

const PreuveCovoiturage = ({
  match: {
    params: { enrollmentId },
  },
}) => (
  <div className="dashboard">
    <Nav
      navLinks={[
        { id: 'head', label: 'Formulaire', style: { fontWeight: 'bold' } },
        { id: 'organisation', label: 'Organisation' },
        { id: 'description', label: 'Description' },
        { id: 'donnees', label: 'Données' },
        { id: 'cadre-juridique', label: 'Cadre juridique' },
        { id: 'donnees-personnelles', label: 'Données personnelles' },
        { id: 'contacts-moe', label: 'Mise en œuvre' },
        { id: 'cgu', label: 'Modalités d’utilisation' },
      ]}
      contactInformation={[
        {
          email: 'contact@covoiturage.beta.gouv.fr',
          label: 'Nous contacter',
          subject: 'Contact%20via%20datapass.api.gouv.fr',
        },
      ]}
    />
    <div className="main">
      <Form
        enrollmentId={enrollmentId}
        target_api="preuve_covoiturage"
        title="Demande d’accès au Registre de preuve de covoiturage"
        DemarcheDescription={DemarcheDescription}
      >
        <OrganisationSection />
        <DescriptionSection />
        <DonneesSection availableScopes={availableScopes} />
        <CadreJuridiqueSection />
        <DonneesPersonnellesSection />
        <MiseEnOeuvreSection />
        <CguSection cguLink="https://registre-preuve-de-covoiturage.gitbook.io/produit/cgu" />
      </Form>
    </div>
  </div>
);

PreuveCovoiturage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      enrollmentId: PropTypes.string,
    }),
  }),
};

PreuveCovoiturage.defaultProps = {
  match: {
    params: {
      enrollmentId: null,
    },
  },
};

export default PreuveCovoiturage;
