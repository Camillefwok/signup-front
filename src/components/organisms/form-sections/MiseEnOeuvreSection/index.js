import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import Contact from './Contact';
import { ScrollablePanel } from '../../Scrollable';
import { FormContext } from '../../../templates/Form';
import Quote from '../../../atoms/inputs/Quote';

const MiseEnOeuvreSection = ({
  initialContacts = {},
  AdditionalMiseEnOeuvreContent = () => null,
  title = 'La mise en œuvre du service',
  MiseEnOeuvreDescription = () => (
    <Quote>
      <p>
        Afin de fluidifier la suite de votre demande merci de renseigner les
        informations suivantes.
      </p>
    </Quote>
  ),
}) => {
  const {
    disabled,
    onChange,
    enrollment: { contacts, additional_content = {} },
  } = useContext(FormContext);

  useEffect(() => {
    if (isEmpty(contacts)) {
      // initialize contacts
      const defaultContacts = {
        technique: {
          heading: 'Responsable technique',
          description: (
            <p>
              Cette personne recevra les accès techniques par mail. Le
              responsable technique peut être le contact technique de votre
              prestataire.
            </p>
          ),
          email: '',
        },
      };

      onChange({
        target: {
          name: 'contacts',
          value: !isEmpty(initialContacts) ? initialContacts : defaultContacts,
        },
      });
    }
  });

  if (isEmpty(contacts)) {
    return null;
  }

  return (
    <ScrollablePanel scrollableId="contacts-moe">
      <h2>{title}</h2>
      <MiseEnOeuvreDescription />
      <AdditionalMiseEnOeuvreContent
        disabled={disabled}
        onChange={onChange}
        additional_content={additional_content}
      />
      <div className="form__group">
        <div className="row">
          {/*
            mind that there might be other legacy contact type present in production database that we
            do not want to display here
          */}
          {!isEmpty(contacts.metier) && (
            <Contact
              id={'metier'}
              {...contacts.metier}
              disabled={disabled}
              onChange={onChange}
            />
          )}
          {!isEmpty(contacts.technique) && (
            <Contact
              id={'technique'}
              {...contacts.technique}
              disabled={disabled}
              onChange={onChange}
            />
          )}
        </div>
      </div>
    </ScrollablePanel>
  );
};

const contactPropTypesShape = {
  technique: PropTypes.shape({
    heading: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
  }),
  metier: PropTypes.shape({
    heading: PropTypes.string,
    email: PropTypes.string,
    phone_number: PropTypes.string,
  }),
};

MiseEnOeuvreSection.propTypes = {
  AdditionalMiseEnOeuvreContent: PropTypes.func,
  initialContacts: PropTypes.shape(contactPropTypesShape),
  title: PropTypes.string,
  MiseEnOeuvreDescription: PropTypes.func,
};

export default MiseEnOeuvreSection;
