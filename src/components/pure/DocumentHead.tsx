interface IDocumentHeadProps {
  title?: string;
  description?: string;
  iconHref?: string;
}

export const DocumentHead: React.FC<IDocumentHeadProps> = ({
  title,
  description,
  iconHref,
}) => {
  return (
    <>
      <title>{title ?? 'ENS Maxis Gallery'}</title>
      <meta
        name='description'
        content={description ?? 'The unofficial ENS Maxis Gallery'}
      />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href={iconHref ?? './assets/EnsMaxisLogo.svg'} />
    </>
  );
};
