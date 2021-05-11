import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Prompt from './Prompt';
import DoneIcon from '../../../atoms/icons/done';
import Loader from '../../../atoms/Loader';
import { triggerAction } from './trigger-action';

const actionToDisplayInfo = {
  notify: {
    label: 'Envoyer un message',
    cssClass: 'secondary',
  },
  destroy: {
    label: 'Supprimer la demande',
    cssClass: 'warning',
  },
  update: {
    label: 'Sauvegarder le brouillon',
    cssClass: 'secondary',
  },
  send_application: {
    label: 'Soumettre la demande',
    icon: <DoneIcon color="white" />,
    cssClass: 'primary',
  },
  refuse_application: {
    label: 'Refuser',
    cssClass: 'warning',
  },
  review_application: {
    label: 'Demander une modification',
    cssClass: 'secondary',
  },
  validate_application: {
    label: 'Valider',
    cssClass: 'primary',
  },
};

const transformAclToButtonsParams = (acl, formSubmitHandlerFactory) =>
  // acl = {'send_application': true, 'review_application': false, 'create': true}
  _(actionToDisplayInfo)
    .pickBy((value, key) => acl[key])
    // {'send_application': {label: ..., cssClass: ...}}
    .keys()
    // ['send_application']
    .map(action => ({
      id: action,
      label: actionToDisplayInfo[action].label,
      icon: actionToDisplayInfo[action].icon,
      cssClass: actionToDisplayInfo[action].cssClass,
      trigger: formSubmitHandlerFactory(action),
    }))
    // [{id: 'send_application', trigger: ..., label: 'Envoyer'}]
    .value();

const ActionButton = ({ enrollment, handleSubmit, updateEnrollment }) => {
  const {
    target_api,
    user: { email: ownerEmailAddress } = { email: null },
  } = enrollment;

  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [intendedAction, setIntendedAction] = useState('');

  const confirmPrompt = useRef();
  const cancelPrompt = useRef();

  const formSubmitHandlerFactory = (
    action,
    setLoading,
    setShowPrompt,
    setIntendedAction,
    handleSubmit,
    enrollment,
    updateEnrollment
  ) => {
    return async event => {
      event.preventDefault();
      setLoading(true);

      const userInteractionPromise = new Promise((resolve, reject) => {
        confirmPrompt.current = resolve;
        cancelPrompt.current = reject;
      });
      const resultMessages = await triggerAction(
        action,
        setShowPrompt,
        setIntendedAction,
        enrollment,
        userInteractionPromise,
        updateEnrollment
      );

      setLoading(false);
      handleSubmit(resultMessages);
    };
  };
  const buttonsParams = transformAclToButtonsParams(enrollment.acl, action =>
    formSubmitHandlerFactory(
      action,
      setLoading,
      setShowPrompt,
      setIntendedAction,
      handleSubmit,
      enrollment,
      updateEnrollment
    )
  );
  const onPromptConfirm = (message, fullEditMode) => {
    setShowPrompt(false);
    setIntendedAction('');
    confirmPrompt.current({ message, fullEditMode });
  };
  const onPromptCancel = () => {
    setShowPrompt(false);
    setIntendedAction('');
    cancelPrompt.current();
  };
  return (
    <>
      <div className="button-list action">
        {buttonsParams.map(({ cssClass, icon, id, label, trigger }) => (
          <button
            key={id}
            className={`button large enrollment ${cssClass}`}
            onClick={trigger}
            disabled={loading}
          >
            <div className="button-icon">{icon}</div>
            <div>
              {label}
              {loading && intendedAction === id && <Loader small />}
            </div>
          </button>
        ))}
      </div>

      {showPrompt && (
        <Prompt
          onAccept={onPromptConfirm}
          onCancel={onPromptCancel}
          acceptLabel={actionToDisplayInfo[intendedAction].label}
          acceptCssClass={actionToDisplayInfo[intendedAction].cssClass}
          selectedAction={intendedAction}
          targetApi={target_api}
          ownerEmailAddress={ownerEmailAddress}
        />
      )}
    </>
  );
};

ActionButton.propTypes = {
  enrollment: PropTypes.object.isRequired,
  updateEnrollment: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default ActionButton;
