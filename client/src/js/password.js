function showPassword () {
  const pwordField = document.getElementById('pwordField');

  if (pwordField.type === 'password') {
    pwordField.type = 'text';
  } else {
    pwordField.type = 'password';
  }
}
