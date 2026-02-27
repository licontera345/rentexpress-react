function SearchField({ id, label, icon: Icon, children, wrapperClassName }) {
  return (
    <div className={wrapperClassName || 'search-group'}>
      <label className="search-label" htmlFor={id}>
        {Icon && <Icon aria-hidden="true" className="search-label-icon" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default SearchField;
