import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { PasswordForm } from './PasswordForm';
import { UiProvider } from '@/testing/UiProvider';
import { i18n } from '@/i18n';

const onSubmit = jest.fn();
const onBack = jest.fn();

const PREFIX = 'auth-change-password';
const STRONG_PASSWORD = 'Str0ng!pass';

function renderForm(withCurrentPassword: boolean) {
  return render(
    <PasswordForm
      testIDPrefix={PREFIX}
      title={i18n.t('auth.change_password_title')}
      subtitle={i18n.t('auth.change_password_subtitle')}
      submitLabel={i18n.t('auth.change_password_button')}
      withCurrentPassword={withCurrentPassword}
      isSubmitting={false}
      onBack={onBack}
      onSubmit={onSubmit}
    />,
    { wrapper: UiProvider },
  );
}

describe('PasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Every fireEvent has to be awaited: an unawaited one leaves an act() scope
  // open and every later render in this file comes back empty.
  it('hands the entered passwords to its caller', async () => {
    const view = await renderForm(true);

    await fireEvent.changeText(view.getByTestId(`${PREFIX}-current-input`), 'Old!pass1');
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-new-input`), STRONG_PASSWORD);
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-confirm-input`), STRONG_PASSWORD);
    await fireEvent.press(view.getByTestId(`${PREFIX}-submit`));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ currentPassword: 'Old!pass1', newPassword: STRONG_PASSWORD }),
        expect.anything(),
      ),
    );
  });

  it('refuses a confirmation that does not match', async () => {
    const view = await renderForm(true);

    await fireEvent.changeText(view.getByTestId(`${PREFIX}-current-input`), 'Old!pass1');
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-new-input`), STRONG_PASSWORD);
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-confirm-input`), 'An0ther!pass');
    await fireEvent.press(view.getByTestId(`${PREFIX}-submit`));

    await waitFor(() => expect(view.getByText(i18n.t('auth.validation_passwords_mismatch'))).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('refuses a new password that repeats the current one', async () => {
    const view = await renderForm(true);

    await fireEvent.changeText(view.getByTestId(`${PREFIX}-current-input`), STRONG_PASSWORD);
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-new-input`), STRONG_PASSWORD);
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-confirm-input`), STRONG_PASSWORD);
    await fireEvent.press(view.getByTestId(`${PREFIX}-submit`));

    await waitFor(() => expect(view.getByText(i18n.t('auth.change_password_same'))).toBeTruthy());
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('asks for no current password in the recovery flow, where there is none to give', async () => {
    const view = await renderForm(false);

    expect(view.queryByTestId(`${PREFIX}-current-input`)).toBeNull();

    await fireEvent.changeText(view.getByTestId(`${PREFIX}-new-input`), STRONG_PASSWORD);
    await fireEvent.changeText(view.getByTestId(`${PREFIX}-confirm-input`), STRONG_PASSWORD);
    await fireEvent.press(view.getByTestId(`${PREFIX}-submit`));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ newPassword: STRONG_PASSWORD }),
        expect.anything(),
      ),
    );
  });

  it('goes back when the back control is pressed', async () => {
    const view = await renderForm(false);

    await fireEvent.press(view.getByTestId(`${PREFIX}-back`));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
