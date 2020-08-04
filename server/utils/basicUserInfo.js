const userBasicInfo = (user) => {
  if (user.method === 'local') {
    const {
      _id,
      method,
      role,
      active,
      local: { name, email },
    } = user;

    return {
      _id,
      method,
      role,
      active,
      name,
      email,
    };
  }
  const {
    _id,
    method,
    role,
    active,
    google: { name, email },
  } = user;

  return {
    _id,
    method,
    role,
    active,
    name,
    email,
  };
};

module.exports = {
  userBasicInfo,
};
