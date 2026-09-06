import DetailPage from "@/components/detailPage";
// import { createClient } from "@/utils/supabase/server";

export default async function ProductPage({ params }: { params: { id: string | number } }) {
  // const supabase = createClient();

  // lấy account + category name
  // const { data: acc, error } = await supabase
  //   .from("accounts")
  //   .select("*, categories(name)")
  //   .eq("id", params.id)
  //   .single();

  // if (!acc || error) {
  //   return <h1>Không tìm thấy sản phẩm</h1>
  // }

  return <div>
    {/* <DetailPage data={acc} /> */}
    <h1>Product Page</h1>
  </div>;
}