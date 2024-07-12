import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

const AboutCard = () => {
  return (
    <Card className="w-full p-4">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Intro</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium">Bio</h4>
          <p className="text-gray-600">"This is a placeholder for the bio."</p>
        </div>
        <div>
          <h4 className="font-medium">Address</h4>
          <p className="text-gray-600">
            "This is a placeholder for the address."
          </p>
        </div>
        <div>
          <h4 className="font-medium">Followers</h4>
          <p className="text-gray-600">1234</p>
        </div>
        <div>
          <h4 className="font-medium">Followings</h4>
          <p className="text-gray-600">5678</p>
        </div>
        <div>
          <h4 className="font-medium">Email</h4>
          <p className="text-gray-600">user@example.com</p>
        </div>
        <div>
          <h4 className="font-medium">Joined At</h4>
          <p className="text-gray-600">January 1, 2020</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AboutCard;
