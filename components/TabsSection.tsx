import { Tabs, Tab } from "@nextui-org/tabs";

const TabsSection = () => {
  return (
    <Tabs className="my-16 text-8xl" size="lg" aria-label="Display" variant="underlined" disabledKeys={["relations", "characters", "staff", "reviews"]}>
      <Tab key="overview" title="Overview" />
      <Tab key="relations" title="Relations" />
      <Tab key="characters" title="Characters" />
      <Tab key="staff" title="Staff" />
      <Tab key="reviews" title="Reviews" />
    </Tabs>
  );
};

export default TabsSection;
