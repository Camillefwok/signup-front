import React, { useContext } from 'react';
import { FormContext } from '../../../templates/Form';
import { ScrollablePanel } from '../../Scrollable';
import YesNoRadioInput from '../../../atoms/inputs/YesNoRadioInput';
import NumberInput from '../../../atoms/inputs/NumberInput';
import FileInput from '../../../molecules/FileInput';

export const AidantsSection = () => {
  const {
    disabled,
    onChange,
    enrollment: {
      documents = [],
      documents_attributes = [],
      additional_content: {
        utilisation_identifiants_usagers = null,
        demandes_par_semaines = '',
        adresse_mail_professionnelle = null,
      },
    },
  } = useContext(FormContext);

  return (
    <ScrollablePanel scrollableId="aidants">
      <h2>Les aidants</h2>
      <FileInput
        label={
          <>
            Liste des aidants à habiliter (
            <a href={`/docs/liste_des_aidants_a_habiliter.xlsx`} download>
              utilisez le modèle suivant
            </a>
            )
          </>
        }
        disabled={disabled}
        documentType={'Document::ListeAidants'}
        mimeTypes=".ods, .xls, .xlsx, .csv"
        uploadedDocuments={documents}
        handleChange={onChange}
        documentsToUpload={documents_attributes}
      />
      <YesNoRadioInput
        label={
          <>
            Les aidants réalisent-ils des démarches administratives à la place
            d’usagers (connexion avec les codes de l’usager) ?
          </>
        }
        name="additional_content.utilisation_identifiants_usagers"
        value={utilisation_identifiants_usagers}
        disabled={disabled}
        onChange={onChange}
      />
      <NumberInput
        label="Si oui, combien de demandes par semaine ?"
        name="additional_content.demandes_par_semaines"
        value={demandes_par_semaines}
        disabled={disabled}
        onChange={onChange}
      />
      <YesNoRadioInput
        label={
          <>
            Les aidants à habiliter ont-ils bien une adresse mail
            professionnelle individuelle ?
          </>
        }
        name="additional_content.adresse_mail_professionnelle"
        value={adresse_mail_professionnelle}
        disabled={disabled}
        onChange={onChange}
      />
    </ScrollablePanel>
  );
};

export default AidantsSection;
