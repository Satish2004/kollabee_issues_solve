import RequestForm from '@/components/request/request-form';

type RequestPageProps = {
  params: {
    sellerId: string;
  };
};

export default function RequestPage({ params }: RequestPageProps) {
  const { sellerId } = params;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Request</h1>
      <RequestForm sellerId={sellerId} />
    </div>
  );
}
