import ContentModerationContainer from "./_Component/Content-ModerationContainer";

export const metadata = {
  title: "Content Moderation",
  description: "Admin content moderation page",
};

export default function page() {
  return (
    <div>
      <ContentModerationContainer />
    </div>
  );
}
