import { auth, db } from '../../../firebase';

export const authState = (formData,userData) => {
  const isAdminValue = userData && userData.isAdmin ? userData.isAdmin : true;
  const rolValue =
    formData.rol === 'PROFESOR' || formData.rol === 'ADMINISTRADOR' || formData.rol === 'MANTENIMIENTO'
      ? formData.rol
      : null;
  return {
    type: 'AUTH_SUCCESS',
    payload: {
      uid: formData.uid,
      displayName: formData.displayName,
      email: formData.email,
      photoURL: formData.photoURL,
      rol: rolValue,
      departamento: formData.departamento,
      cargo: formData.cargo,
      name: formData.name,
      isAdmin: isAdminValue,
    },
  };
};

export const login = (formData) => async (dispatch) => {
  try {
    dispatch({ type: 'USER_LOGIN_REQUEST' });
    const sign = await auth.signInWithEmailAndPassword(formData.email, formData.password);
    const userDoc = await db.collection('usuarios').doc(sign.user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      const user = {
        uid: sign.user.uid,
        displayName: sign.user.displayName,
        email: sign.user.email,
        photoURL: sign.user.photoURL,
        rol: userData?.rol || null,
        departamento: formData.departamento,
        cargo: formData.cargo,
        name: formData.name,
        isAdmin: userData?.isAdmin,
      };
          dispatch({
              type: 'USER_LOGIN_SUCCESS',
              payload: user
          })
        }
  } catch (error) {
      dispatch({
          type: 'USER_LOGIN_FAIL',
          payload: error,
      })
  }
}