export default {
    route: state => state.route,
    profile: state => state.profile,
    error: state => state.error,
    pending: state => state.pending,
    isSuperAdmin: state => state.profile && state.profile.role === 'SuperAdmin',
    isAdmin: state => state.profile && /^(Super)?Admin$/.test(state.profile.role),
    isClient: state => state.profile && state.profile.role === 'Client',
}