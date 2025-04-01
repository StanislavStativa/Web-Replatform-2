const Heading = ({ tag, children }: { tag: string; children: React.ReactNode }) => {
  switch (tag) {
    case 'h1':
      return <h1>{children}</h1>;
    case 'h3':
      return <h2>{children}</h2>;
    case 'h4':
      return <h3>{children}</h3>;
    case 'h5':
      return <h4>{children}</h4>;
    case 'h6':
      return <h5>{children}</h5>;
    default:
      return <h2>{children}</h2>;
  }
};
export default Heading;
