import {
  Routes,
  Route,
} from "react-router-dom";

import AdminLayout from "../components/layout/AdminLayout";

import DashboardPage from "../pages/DashboardPage";
// import PeoplePage from "../pages/PeoplePage";
import OrganisationsPage from "../pages/OrganisationsPage";
import OrganisationReviewsPage from "../pages/OrganisationReviewsPage";
import OrganisationReviewDetailPage from "../pages/OrganisationReviewDetailPage";
import PartnershipsPage from "../pages/PartnershipsPage";
import PeoplePage from "../pages/PeoplePage";
import ProjectsPage from "../pages/ProjectsPage";
import ResearchPage from "../pages/ResearchPage";
import InnovationsPage from "../pages/InnovationsPage";
import KnowledgePage from "../pages/KnowledgePage";
import OpportunitiesPage from "../pages/OpportunitiesPage";
import ApicultureApplicationsAdmin from "../pages/ApicultureApplicationsAdmin";
// import MarketplacePage from "../pages/MarketplacePage";
// import ImpactPage from "../pages/ImpactPage";
// import SettingsPage from "../pages/SettingsPage";


import LoginPage from "../pages/LoginPage";

export default function AppRouter() {
  return (
    <Routes>
        <Route
        path="/"
        element={<LoginPage />}
      />


      <Route
        element={<AdminLayout />}
      >
        <Route
          path="/dashboard"
          element={
            <DashboardPage />
          }
        />

        <Route
          path="/organisations"
          element={
            <OrganisationsPage />
          }
        />

        <Route
          path="/organisation-reviews"
          element={
            <OrganisationReviewsPage />
          }
        />

        <Route
          path="/organisation-reviews/:slug"
          element={
          <OrganisationReviewDetailPage />
        }
       />
       <Route
          path="/partnerships"
          element={<PartnershipsPage />}
        />

        <Route path="/people" element={<PeoplePage />} />

        <Route
          path="/projects"
          element={
            <ProjectsPage />
          }
        />

        <Route
          path="/research"
          element={
            <ResearchPage />
          }
        /> 

         <Route
          path="/innovations"
          element={
            <InnovationsPage />
          }
        />

        <Route
          path="/knowledge"
          element={
            <KnowledgePage />
          }
        />

        <Route
          path="/opportunities"
          element={
            <OpportunitiesPage />
          }
        />

        <Route
          path="/apiculture-applications"
          element={<ApicultureApplicationsAdmin />}
        />

        {/* <Route
          path="/marketplace"
          element={
            <MarketplacePage />
          }
        />

        <Route
          path="/impact"
          element={
            <ImpactPage />
          }
        />

        <Route
          path="/settings"
          element={
            <SettingsPage />
          }
        /> */}
      </Route>
    </Routes>
  );
}